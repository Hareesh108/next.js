import { dirname } from 'path'
import findUp from 'next/dist/compiled/find-up'
import * as Log from '../build/output/log'

export function findRootLockFile(cwd: string) {
  return findUp.sync(
    [
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock',
      'bun.lock',
      'bun.lockb',
    ],
    {
      cwd,
    }
  )
}

export function findRootDir(cwd: string) {
  let lockFile = findRootLockFile(cwd)
  if (!lockFile) return undefined

  let lockFiles = [lockFile]
  while (lockFile) {
    const nextDir = dirname(dirname(lockFile))
    const newLockFile = findRootLockFile(nextDir)

    if (newLockFile) {
      lockFiles.push(newLockFile)
      lockFile = newLockFile
    } else {
      break
    }
  }

  if (lockFiles.length > 1) {
    Log.warnOnce(
      `Warning: Found multiple lockfiles. Consider removing the lockfiles at ${lockFiles
        .slice(0, lockFiles.length - 1)
        .map((str) => '\n   * ' + str)
        .join('')}\n`
    )
  }

  return lockFile ? dirname(lockFile) : undefined
}
