import { Project, UpdateProject, tokenInit, balanceOf } from "./model";


export function create(title: string, address: string, type: string, price: u64, size: u32, status: string, photo: string): Project {
  return Project.createProject(title, address, type, price, size, status, photo);
}

export function initTokens(owner: string): string{
  return tokenInit(owner);
}

export function showTokens(owner: string): u64{
  return balanceOf(owner);
}

export function sendToken(to: string, tokens: u64): string {
  return Project.transferToken(to, tokens);
}

export function distributeToken(from: string, to: string, tokens: u64): string {
  return Project.shareToken(from, to, tokens);
}

export function getById(projectId: u32): Project {
  return Project.findProjectById(projectId);
}

export function getAllProjects(offset: u32, end: u32): Project[] {
  return Project.getProjects(offset, end);
}

export function update(projectId: u32, update: UpdateProject): Project {
  return Project.updateProjectById(projectId, update);
}

export function fundProject(projectId: u32 ): string {
  //return Project.donate()
  return Project.fundProject(projectId);
}

export function del(projectId: u32): void {
  Project.deleteById(projectId);
}