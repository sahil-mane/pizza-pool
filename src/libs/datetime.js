export function dbTimeForHuman(str) {
    return str.replace("T", " ").split(".")[0]; 
}