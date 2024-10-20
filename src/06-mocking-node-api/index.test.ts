import { join } from 'path';
import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  readFile: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

const mockPath = 'mockFile.txt';

describe('doStuffByTimeout', () => {
  const originalSetTimeout = global.setTimeout;
  const setTimeoutMock = Object.assign(jest.fn(), {
    __promisify__: originalSetTimeout.__promisify__,
  });

  beforeAll(() => {
    global.setTimeout = setTimeoutMock;
  });

  afterAll(() => {
    global.setTimeout = originalSetTimeout;
  });

  afterEach(() => {
    setTimeoutMock.mockClear();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(setTimeoutMock).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    setTimeoutMock.mock.calls[0][0]();

    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  const originalSetInterval = global.setInterval;
  const setIntervalMock = Object.assign(jest.fn(), {
    __promisify__: originalSetInterval.__promisify__,
  });

  beforeAll(() => {
    global.setInterval = setIntervalMock;
  });

  afterAll(() => {
    global.setInterval = originalSetInterval;
  });

  afterEach(() => {
    setIntervalMock.mockClear();
  });

  test('should set interval with provided callback and interval', () => {
    const callback = jest.fn();
    const interval = 500;

    doStuffByInterval(callback, interval);

    expect(setIntervalMock).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 500;

    doStuffByInterval(callback, interval);

    setIntervalMock.mock.calls[0][0]();
    setIntervalMock.mock.calls[0][0]();
    setIntervalMock.mock.calls[0][0]();

    expect(callback).toHaveBeenCalledTimes(3);
  });

  describe('readFileAsynchronously', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should call join with correct path', async () => {
      const fullPath = '/full/path/to/file.txt';

      (join as jest.Mock).mockReturnValue(fullPath);
      (existsSync as jest.Mock).mockReturnValue(false);

      await readFileAsynchronously(mockPath);

      expect(join).toHaveBeenCalledWith(__dirname, mockPath);
    });

    test('should return null if file does not exist', async () => {
      const fullPath = '/full/path/to/file.txt';

      (join as jest.Mock).mockReturnValue(fullPath);
      (existsSync as jest.Mock).mockReturnValue(false);

      const result = await readFileAsynchronously(mockPath);
      expect(existsSync).toHaveBeenCalledWith(fullPath);
      expect(result).toBeNull();
      expect(existsSync).toHaveBeenCalledWith(fullPath);
    });

    test('should return file content if file exists', async () => {
      const fileContent = 'file content';
      const fullPath = '/full/path/to/file.txt';

      (join as jest.Mock).mockReturnValue(fullPath);
      (existsSync as jest.Mock).mockReturnValue(true);
      (readFile as jest.Mock).mockResolvedValue(Buffer.from(fileContent));

      const result = await readFileAsynchronously(mockPath);

      console.log('Result:', result);

      expect(result).toBe(fileContent);
      expect(join).toHaveBeenCalledWith(__dirname, mockPath);
      expect(existsSync).toHaveBeenCalledWith(fullPath);
      expect(readFile).toHaveBeenCalledWith(fullPath);
    });
  });
});
