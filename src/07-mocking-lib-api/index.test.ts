import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('should create instance with provided base url', async () => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: 'data' }),
    });
    await throttledGetDataFromApi('path');
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const axiosClientMock = {
      get: jest.fn().mockResolvedValue({ data: 'data' }),
    };
    (axios.create as jest.Mock).mockReturnValue(axiosClientMock);
    jest.advanceTimersByTime(5000);
    await throttledGetDataFromApi('path');
    expect(axiosClientMock.get).toHaveBeenCalledWith('path');
  });

  test('should return response data', async () => {
    const relativePath = '/posts';
    const mockData = [{ id: 1, title: 'Mock Post' }];

    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await throttledGetDataFromApi(relativePath);
    expect(result).toEqual(mockData);
  });
});
