import { Shape } from "../state/store";

export default class UpdateObserver {
  private static instance: UpdateObserver;
  private url?: string;

  private constructor() {}

  public static getInstance = () => {
    if (UpdateObserver.instance === undefined) {
      UpdateObserver.instance = new UpdateObserver();
    }
    return UpdateObserver.instance;
  };

  public setUrl = (url: string) => {
    this.url = url;
  };

  public getUrl() {
    return this.url;
  }

  public notify = (data: Partial<Shape>) => {
    if (!this.url) return;
    console.log("I get notified");
    console.log(this.url);
    console.log(data);
  };
}
