import { beforeEach, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto';

import { db } from "./src/db/client";

beforeEach( async() => {
  await db.delete();
  await db.open();
})

afterEach(() => {
  cleanup()
})