import { BaseModel } from "./common";

export interface Template extends BaseModel {
    name: string
	language: string
	content: string
	description: string
}