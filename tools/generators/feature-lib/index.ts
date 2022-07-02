import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

interface Schema {
  name: string;
  directory: 'store' | 'api' | 'shared';
}

export default async function (tree: Tree, schema: Schema) {
  await libraryGenerator(tree, {
    name: `feature-${schema.name}`,
    directory: schema.directory,
    tags: `type:feature,scope:${schema.directory}`,
  });
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
