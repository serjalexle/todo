export interface ITask {
    _id: string
    title: string
    description: string 
    status: "queue" | "progress" | "completed"
}