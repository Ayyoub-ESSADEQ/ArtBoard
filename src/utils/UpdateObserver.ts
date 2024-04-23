import { Shape } from "Store";

export class UpdateObserver {
  private static instance: UpdateObserver;
  private url?: string;
  private whiteboardId?: string;

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

  public setWhiteboardId(id: string) {
    this.whiteboardId = id;
  }

  public getWhiteboardId() {
    return this.whiteboardId;
  }

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
