import { promises as fs } from 'fs';
import commandLineArgs from 'command-line-args';
import { inspect as gltfInspect } from "@gltf-transform/functions";


export const humanFileSize = (bytes, dp = 2) => {
    const thresh = 1024;
  
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
  
    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
};


export const printNode = (node, depth) => {
    const padding = depth ? ''.padStart(depth * 4, '-') : '';
    console.log(padding + node.getName());

    const children = node.listChildren();
    for(let i = 0; i < children.length; i++) {
        printNode(children[i], depth + 1);
    }
};


export const nextPoT = (n) => {
    const power = Math.ceil(Math.log2(n));
    return 2 ** power;
};


export const inspect = (document) => {
    const data = gltfInspect(document);

    let sizes = {
        total: 0,
        meshes: 0,
        textures: 0,
        vram: 0
    };

    for(let i = 0; i < data.meshes.properties.length; i++)
        sizes.meshes += data.meshes.properties[i].size;
    
    for(let i = 0; i < data.textures.properties.length; i++) {
        sizes.textures += data.textures.properties[i].size;
        sizes.vram += data.textures.properties[i].gpuSize;
    }

    sizes.total += sizes.meshes;
    sizes.total += sizes.textures;

    return { data: data, sizes: sizes };
};


export const parseArgs = async (isImported = false) => {
    const options = commandLineArgs([{
        name: 'help',
        alias: 'h',
        verbose: true,
        type: Boolean,
        defaultValue: false
    }, {
        name: 'file',
        alias: 'f',
        type: String
    }, {
        name: 'output',
        alias: 'o',
        type: String
    }, {
        name: 'merge',
        alias: 'm',
        verbose: true,
        type: Boolean,
        defaultValue: false
    }, {
        name: 'silent',
        alias: 's',
        verbose: true,
        type: Boolean,
        defaultValue: false
    }, {
        name: 'inspect',
        alias: 'i',
        verbose: true,
        type: Boolean,
        defaultValue: false
    }]);

    // Skip validation when imported programmatically
    if (isImported) {
        return options;
    }

    if (options.help || process.argv.length <= 2) {
        console.log('CLI tool for converting GLTF avatars from sandbox.game into MSquared avatar, with list of options:');
        console.log('    --file\tGLB file to convert. Mandatory.');
        console.log('    --output\tPath for a output GLB file. Mandatory.');
        console.log('    --merge\tMerges all meshes into a single one and textures into a single atlas. Default true.');
        console.log('    --silent\tDo not console logs, unless there is an error. Default false.');
        console.log('    --inspect\tPrint GLB structure at the end. Default false.');
        process.exit(0);
    }
    
    if (!options.file) {
        console.warn('Please provide --file to merge');
        process.exit(0);
    } else {
        await fs.stat(options.file);
    }

    if (!options.output) {
        console.warn('Please provide --output path for glb');
        process.exit(0);
    }
    
    return options;
};