import {
  Tree,
  formatFiles,
  updateJson,
  ProjectConfiguration,
  getProjects,
  updateProjectConfiguration,
} from '@nrwl/devkit';

// function getScopes(projectMap: Map<string, ProjectConfiguration>) {
//   const projects: any[] = Object.values(projectMap);
//   const allScopes: string[] = projects
//     .map((project) =>
//       project.tags
//         // take only those that point to scope
//         .filter((tag: string) => tag.startsWith('scope:'))
//     )
//     // flatten the array
//     .reduce((acc, tags) => [...acc, ...tags], [])
//     // remove prefix `scope:`
//     .map((scope: string) => scope.slice(6));
//   // remove duplicates
//   return Array.from(new Set(allScopes));
// }

function getScopes(projectMap: Map<string, ProjectConfiguration>): string[] {
  const projects = Object.fromEntries(projectMap);
  const allProjects: any[] = Object.values(projects);
  const allScopes = allProjects
    .map((project) =>
      project.tags.filter((tag: string) => tag.startsWith('scope:'))
    )
    .reduce((curr, tag) => [...curr, ...tag], [])
    .map((scope: string) => scope.slice(6));
  return Array.from(new Set(allScopes));
}

function addScopeIfMissing(host: Tree) {
  const projectMap = Object.fromEntries(getProjects(host));
  Object.keys(projectMap).forEach((projectName) => {
    const project = projectMap[projectName];
    if (!project.tags?.some((tag) => tag.startsWith('scope:'))) {
      const scope = projectName.split('-')[0];
      project.tags?.push(`scope:${scope}`);
      updateProjectConfiguration(host, projectName, project);
    }
  });
}

function replaceScopes(content: string, scopes: string[]): string {
  const joinScopes = scopes.map((s) => `'${s}'`).join(' | ');
  const PATTERN = /interface Schema \{\n.*\n.*\n\}/gm;
  return content.replace(
    PATTERN,
    `interface Schema {
      name: string;
      directory: ${joinScopes};
    }`
  );
}

export default async function (host: Tree) {
  addScopeIfMissing(host);
  const scopes = getScopes(getProjects(host));
  updateJson(host, 'tools/generators/util-lib/schema.json', (schemaJson) => {
    schemaJson.properties.directory['x-prompt'].items = scopes.map((scope) => ({
      value: scope,
      label: scope,
    }));
    return schemaJson;
  });
  const content = host.read('tools/generators/util-lib/index.ts', 'utf-8')!;
  console.log(content);
  const newContent = replaceScopes(content, scopes);
  host.write('tools/generators/util-lib/index.ts', newContent);
  await formatFiles(host);
}

// export default async function (host: Tree) {
//   console.log(host);
//   const scopes = getScopes(getProjects(host));
//   updateJson(host, 'tools/generators/util-lib/schema.json', (schemaJson) => {
//     schemaJson.properties.directory['x-prompt'].items = scopes.map((scope) => ({
//       value: scope,
//       label: scope,
//     }));
//     return schemaJson;
//   });
//   await formatFiles(host);
// }
