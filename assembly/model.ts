import { context, storage, logging, u128, PersistentMap, PersistentUnorderedMap, math, ContractPromiseBatch, Context } from "near-sdk-as";
import {assert_self, assert_single_promise_success, XCC_GAS} from '../utils';


export const projects = new PersistentUnorderedMap<u32, Project>("p");
export const projectOwnership = new PersistentUnorderedMap<string, Array<u32>>("po")

export const balances = new PersistentMap<string, u64>("balance");

const TOTAL_SUPPLY: u64 = 1000000;

export function tokenInit(initialOwner: string): string {
  assert(storage.get<string>("tokenInit") == null, "Already initialized token supply");
  balances.set(initialOwner, TOTAL_SUPPLY);
  storage.set("tokenInit", "done");
  return "Tokens were initiated"
}

export function balanceOf(owner: string): u64 {
  if (!balances.contains(owner)) {
    return 0;
  }
  const result = balances.getSome(owner);
  return result;
}

@nearBindgen
export class UpdateProject {
  title: string;
  address: string;
  type: string;
  price: u64;
  size: u32;
  status: string;
  photo: string;
}

@nearBindgen
export class Project {
  projectId: u32;
  owner:string;
  token: u64;
  title: string;
  address: string;
  type: string;
  price: u64;
  size: u32;
  status: string;
  photo: string;
  fundsReceived: u128;  
  
  constructor(title: string, address: string, type: string, price: u64, size: u32, status: string, photo: string)  {
    this.projectId = math.hash32<string>(title+address+type+status+price.toString()+size.toString());
    this.owner = context.sender;
    this.token = balanceOf(this.owner);
    this.title = title;
    this.address = address;
    this.type = type;
    this.price = price;
    this.size = size;
    this.status = status;
    this.photo = photo;
    this.fundsReceived = u128.from(0);
  }

  static createProject(title: string, address: string, type: string, price: u64, size: u32, status: string, photo: string): Project {
    assert(title.length>0 , "The project title should be specified");
    assert(address.length>0 , "The project address should be specified");
    assert(type.length>0 , "The project type should be specified");
    assert(price>0 , "The project price should be valid");
    assert(size>0 , "The project usage area should be valid");
    assert(status.length>0 , "The project status should be specified");

    // create a new Project
    const project = new Project(title, address, type, price, size, status, photo);
    const projectId = project.projectId; 
    projects.set(projectId, project); 

    // an owner may have more than one project 
    //Therefore a PersistentUnorderedMap was used to store owners and their projects
    const owner = project.owner;

    if(projectOwnership.contains(owner)) {
      const newPreviousProjectsId = projectOwnership.getSome(owner)
      newPreviousProjectsId.push(projectId);
      projectOwnership.set(owner, newPreviousProjectsId);     
    } else {
      const ownProject = new Array<u32>();
      ownProject.push(projectId)
      projectOwnership.set(owner, ownProject);
    }
    logging.log("Project title : " + project.title+" was created with " + (project.projectId).toString() + " project id");
    logging.log(`Project owner ${project.owner} has ${projectOwnership.getSome(owner)}`);
    return project;    
  }

  // Find a project in the PersistentUnorderedMap by its id
  static findProjectById(projectId: u32): Project {
    return projects.getSome(projectId);
  }

  // Get all projects starting from any place to any place
  // For instance write 0 and 2 only to see first two saved projects
  static getProjects(offset: u32, end:u32): Project[] {
    return projects.values(offset, end);
  }

  static updateProjectById(projectId: u32, update: UpdateProject): Project {
    // find a project by its id
    const project = this.findProjectById(projectId);

    //only owner can update the project
    assert(context.sender == project.owner, "only project owner can update the project")

    project.title = update.title;
    project.address = update.address;
    project.type = update.type;
    project.price = update.price;
    project.size = update.size;
    project.status = update.status;
    project.status = update.photo;

    projects.set(projectId, project);

    return project;
  }

  //when a project receive any funds it has to updated
  static updateProjectFund(projectId: u32, funds: u128): void {
    const project = projects.getSome(projectId);
    project.fundsReceived = u128.add(project.fundsReceived, funds);
    projects.set(projectId, project);
  }

  @mutateState()
  fundDone(): void {
    assert_self()
    assert_single_promise_success()
    logging.log("Fund done")
  }

  static fundProject(projectId: u32): string{
    const funds = context.attachedDeposit;
    const projectOwner = projects.getSome(projectId).owner

    ContractPromiseBatch.create(projectOwner).transfer(funds).then(Context.contractName)
      .function_call("fundDone", "", u128.Zero, XCC_GAS);

    this.updateProjectFund(projectId, funds);
    return `Project ${projectId} has been funded`
  }

  //After token transactions related projects will be updated
  static updateProjectToken(projectId: u32, owner: string): bool {
    const project = projects.getSome(projectId);
    project.token = balanceOf(owner);
    projects.set(projectId, project);
    return true
  }

  static getTokenBalance(owner: string): u64 {
    return balances.contains(owner) ? balances.getSome(owner) : 0;
  }

  static transferToken(to: string, tokens: u64): string {
    const sender = context.sender
    const amount = this.getTokenBalance(sender);
    assert(amount >= tokens, "You do not have enough tokens to send");
    assert(this.getTokenBalance(to) <= this.getTokenBalance(to) + tokens,"overflow at the receiver side");
    balances.set(sender, amount - tokens);
    balances.set(to, this.getTokenBalance(to) + tokens);

    //update the token amounts in projects list
    const senderProjects = projectOwnership.getSome(sender)
    const receiverProjects = projectOwnership.getSome(to)

    let i: i32 = 0;
    while (i < senderProjects.length) {
      this.updateProjectToken(senderProjects[i], sender);
      i++;
    }

    let j: i32 = 0;
    while (j < receiverProjects.length) {
      this.updateProjectToken(receiverProjects[j], to);
      j++;
    }

    return `${sender} transferred ${tokens} tokens to ${to}`;
  }

  //This function is only done by admin and just for show case;
  static shareToken(from: string, to: string, tokens: u64): string {
    assert(context.sender == "setas.testnet", "You do not have permision to distribute tokens");
    const senderTokens = this.getTokenBalance(from);
    assert(senderTokens >= tokens, "You do not have enough tokens to send");
    assert(this.getTokenBalance(to) <= this.getTokenBalance(to) + tokens, "overflow at the receiver side");
    balances.set(from, senderTokens - tokens);
    balances.set(to, this.getTokenBalance(to) + tokens);

    //update the token amounts in project list
    const senderProjects = projectOwnership.getSome(from)
    const receiverProjects = projectOwnership.getSome(to)

    let i: i32 = 0;
    while (i < senderProjects.length) {
      this.updateProjectToken(senderProjects[i], from);
      i++;
    }

    let j: i32 = 0;
    while (j < receiverProjects.length) {
      this.updateProjectToken(receiverProjects[j], to);
      j++;
    }
    
    return `${from} transferred ${tokens} tokens to ${to}`;
  }

  static deleteById(projectId: u32): void {
    //only owner can delete the project
    const owner = projects.getSome(projectId).owner
    assert(context.sender == owner, "You are not the owner of the project")
    projects.delete(projectId);
  }

}
