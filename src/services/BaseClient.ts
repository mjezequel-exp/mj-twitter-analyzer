import { msalInstance, scopes } from "@/authConfig";
import { settings } from "@/settings";
import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export class BaseClient {
    protected apiClient: AxiosInstance;

    protected constructor(url: string) {
        this.apiClient = axios.create({
            baseURL: `${settings.webApi.baseUrl}${url}`,
            responseType: "json",
        });

        this.apiClient.interceptors.request.use(this.requestInterceptor);
        this.apiClient.interceptors.response.use(undefined, this.blobErrorResponseInterceptor);
        this.apiClient.interceptors.response.use(undefined, this.errorResponseInterceptor);
    }

    protected async get<T>(service: string, params?: AxiosRequestConfig, errorMessage?: string): Promise<T | null> {
        try {
            const response = await this.apiClient.get<T>(service, {
                params: params ?? {},
            });

            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error(errorMessage);
            }
        } catch (error) {
            throw new Error(errorMessage);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected async post<T>(service: string, data?: any, errorMessage?: string): Promise<T | null> {
        try {
            const response = await this.apiClient.post<T>(service, data, {});

            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error(errorMessage);
            }
        } catch (error) {
            throw new Error(errorMessage);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected async patch<T>(service: string, data?: any, errorMessage?: string): Promise<T | null> {
        try {
            const response = await this.apiClient.patch<T>(service, data, {});

            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error(errorMessage);
            }
        } catch (error) {
            throw new Error(errorMessage);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected async put<T>(service: string, data?: any, type?: string, errorMessage?: string): Promise<T | null> {
        try {
            const response = await this.apiClient.put<T>(service, data, {
                headers: {
                    "Content-Type": type ?? "application/json",
                },
            });

            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error(errorMessage);
            }
        } catch (error) {
            throw new Error(errorMessage);
        }
    }

    protected async delete<T>(service: string, errorMessage?: string): Promise<T | null> {
        try {
            const response = await this.apiClient.delete<T>(service);

            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error(errorMessage);
            }
        } catch (error) {
            throw new Error(errorMessage);
        }
    }

    protected async downloadPhoto(service: string, errorMessage?: string): Promise<AxiosResponse> {
        try {
            return await this.apiClient.get<string>(service, { responseType: "arraybuffer", timeout: 60_000 });
        } catch (error) {
            throw new Error(errorMessage);
        }
    }

    protected async downloadFile(service: string, params?: AxiosRequestConfig, errorMessage?: string): Promise<Blob> {
        try {
            const response = await this.apiClient.get(service, {
                responseType: "blob",
                timeout: 60_000,
                params: params ?? {},
            });

            return response.data;
        } catch (error) {
            throw new Error(errorMessage);
        }
    }

    protected isAxiosError(error: Error): error is AxiosError {
        return (error as AxiosError).isAxiosError;
    }

    private async requestInterceptor(request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
        const accessToken = await msalInstance.acquireTokenSilent({ scopes });

        // Add Authorization token
        if (accessToken != null && request.headers) {
            request.headers.Authorization = `Bearer ${accessToken}`;
        }

        return Promise.resolve(request);
    }

    private blobErrorResponseInterceptor(error: AxiosError): Promise<AxiosError> {
        const contentType: string = error.response?.headers["content-type"]?.toLowerCase() ?? "";
        if (error.request.responseType === "blob" && contentType.includes("json")) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (): void => {
                    if (error.response) {
                        error.response.data = JSON.parse(reader.result as string);
                        resolve(Promise.reject(error));
                    }
                };

                reader.onerror = (): void => reject(error);

                reader.readAsText(error.response?.data as Blob);
            });
        }

        return Promise.reject(error);
    }

    private async errorResponseInterceptor(error: AxiosError): Promise<AxiosError> {
        // If the user is unauthenticated, retry login
        if (error.response?.status === 401) {
            await msalInstance.getAccessToken(scopes);
        }

        return Promise.reject(error);
    }
}
