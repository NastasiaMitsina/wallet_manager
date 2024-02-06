type InjectedProviders = {
  isMetaMask?: true;
};

export interface Window {
  ethereum: InjectedProviders & {
    on: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    request<T = any>(args: any): Promise<T>;
  };
}
