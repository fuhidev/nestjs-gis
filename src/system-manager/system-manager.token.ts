export interface SystemManagerOptions{
    connection?:string;
  }

 export let systemManagerOption:SystemManagerOptions={}
  export function setOption(option?:SystemManagerOptions){
      systemManagerOption = option || {};
  }