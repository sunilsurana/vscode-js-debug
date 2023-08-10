/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { xxHash32 } from 'js-xxhash';
import { dirname } from 'path';
import { FileGlobList } from '../fileGlobList';
import { readfile, stat } from '../fsUtils';
import { parseSourceMappingUrl } from '../sourceUtils';
import { absolutePathToFileUrl, completeUrl, fileUrlToAbsolutePath, isDataUri } from '../urlUtils';
import { ISourceMapMetadata } from './sourceMap';
import { Counter } from './turboSearchStrategy';

/**
 * A copy of vscode.RelativePattern, but we can't to import 'vscode' here.
 */
export interface IRelativePattern {
  base: string;
  pattern: string;
}

export const ISearchStrategy = Symbol('ISearchStrategy');

// todo@connor4312: fallback search strategy during turbo mode's beta
export const ISearchStrategyFallback = Symbol('ISearchStrategyFallback');

export interface ISourcemapStreamOptions<T, R> {
  /** List of files to find. */
  files: FileGlobList;
  /** First search for processing source map data from disk. T must be JSON-serializable. */
  processMap: (child: Required<ISourceMapMetadata>) => T | Promise<T>;
  /** Second step to handle a processed map. `data` may have been read from cache. */
  onProcessedMap: (data: T) => R | Promise<R>;

  /**
   * Optionally filter for processed files. Only files matching this pattern
   * will have the mtime checked, and _may_ result in onProcessedMap calls.
   */
  filter?: (path: string, child?: T) => boolean;
  /** Last cache state, passing it may speed things up. */
  lastState?: unknown;
}

export interface ISearchStrategy {
  /**
   * Recursively finds all children matching the outFiles. Calls `processMap`
   * when it encounters new files, then `onProcessedMap` with the result of
   * doing so. `onProcessedMap` may be called with previously-cached data.
   *
   * Takes and can return a `state` value to make subsequent searches faster.
   */
  streamChildrenWithSourcemaps<T, R>(
    opts: ISourcemapStreamOptions<T, R>,
  ): Promise<{ values: R[]; state: unknown }>;

  /**
   * Recursively finds all children, calling `onChild` when children are found
   * and returning promise that resolves once all children have been discovered.
   */
  streamAllChildren<T>(
    files: FileGlobList,
    onChild: (child: string) => T | Promise<T>,
  ): Promise<T[]>;

  getExists(): number;

  getNotExists(): number;

  getSorted(): Map<string, number>;
}

/**
 * Generates source map metadata from a path on disk and file contents.
 * @param compiledPath -- Absolute path of the .js file on disk
 * @param fileContents -- Read contents of the file
 */
export const createMetadataForFile = async (
  counter: Counter,
  compiledPath: string,
  fileContents?: string,
): Promise<Required<ISourceMapMetadata> | undefined> => {
  let sourceMapUrl;
  const possibleSourceMapURL = `${compiledPath}.map`;

  if (await stat(possibleSourceMapURL)) {
    sourceMapUrl = possibleSourceMapURL;
    counter.exists++;
  } else {
    if (typeof fileContents === 'undefined') {
      fileContents = await readfile(compiledPath);
    }
    sourceMapUrl = parseSourceMappingUrl(fileContents);
    counter.notExists++;
    let dir = dirname(compiledPath);
    let value = counter.myMap.get(dir);
    if (value && value > 0) {
      counter.myMap.set(dir, value + 1);
    } else {
      counter.myMap.set(dir, 1);
    }
  }
  if (!sourceMapUrl) {
    return;
  }

  const smIsDataUri = isDataUri(sourceMapUrl);
  if (!smIsDataUri) {
    sourceMapUrl = completeUrl(absolutePathToFileUrl(compiledPath), sourceMapUrl);
  }

  if (!sourceMapUrl) {
    return;
  }

  if (!sourceMapUrl.startsWith('data:') && !sourceMapUrl.startsWith('file://')) {
    return;
  }

  let cacheKey: number;
  if (smIsDataUri) {
    cacheKey = xxHash32(sourceMapUrl);
  } else {
    const stats = await stat(fileUrlToAbsolutePath(sourceMapUrl) || compiledPath);
    if (!stats) {
      return; // ENOENT, usually
    }
    cacheKey = stats.mtimeMs;
  }

  return {
    compiledPath,
    sourceMapUrl,
    cacheKey,
  };
};
