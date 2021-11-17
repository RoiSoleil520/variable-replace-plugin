import * as fs from 'fs';

const SASS_VARIABLES_REG =  /(\$[^:\s]+):[\s]*([^;]+);/g;

interface IVariables {
  [key:string]:string;
}

export default function findSassVariables(sassPath: string){
  const variables:IVariables = {};
  if(fs.existsSync(sassPath)){
    const content = fs.readFileSync(sassPath, 'utf-8');
    let matched;
    while((matched = SASS_VARIABLES_REG.exec(content)) !== null){
      variables[matched[1]] = matched[2];
    }
  }

  return variables;
}