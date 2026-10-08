export interface DOMTokenListLike {
  add(...tokens: string[]): void;
  remove(...tokens: string[]): void;
  contains(token: string): boolean;
  toggle(token: string, force?: boolean): boolean;
}

export interface SimpleElement {
  tagName: string;
  className: string;
  classList: DOMTokenListLike;
  textContent: string;
  disabled: boolean;
  type?: string;
  children: SimpleElement[];
  attributes: Record<string, string>;
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string | null;
  hasAttribute(name: string): boolean;
  removeAttribute(name: string): void;
  appendChild(child: SimpleElement): void;
  addEventListener(event: string, handler: (e: any) => void): void;
  removeEventListener(event: string, handler: (e: any) => void): void;
  dispatchEvent(event: any): boolean;
  click(): void;
  focus(): void;
}

class MockClassList implements DOMTokenListLike {
  private element: MockElement;

  constructor(element: MockElement) {
    this.element = element;
  }

  public add(...tokens: string[]): void {
    const set = new Set(this.element.className.split(/\s+/).filter(Boolean));
    for (const t of tokens) set.add(t);
    this.element.className = Array.from(set).join(" ");
  }

  public remove(...tokens: string[]): void {
    const set = new Set(this.element.className.split(/\s+/).filter(Boolean));
    for (const t of tokens) set.delete(t);
    this.element.className = Array.from(set).join(" ");
  }

  public contains(token: string): boolean {
    return this.element.className.split(/\s+/).filter(Boolean).includes(token);
  }

  public toggle(token: string, force?: boolean): boolean {
    if (force === true) {
      this.add(token);
      return true;
    }
    if (force === false) {
      this.remove(token);
      return false;
    }
    if (this.contains(token)) {
      this.remove(token);
      return false;
    }
    this.add(token);
    return true;
  }
}

class MockElement implements SimpleElement {
  public tagName: string;
  public className: string = "";
  public classList: DOMTokenListLike;
  public textContent: string = "";
  public disabled: boolean = false;
  public type?: string;
  public children: SimpleElement[] = [];
  public attributes: Record<string, string> = {};
  private listeners: Record<string, ((e: any) => void)[]> = {};

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
    this.classList = new MockClassList(this);
  }

  public setAttribute(name: string, value: string): void {
    this.attributes[name] = String(value);
  }

  public getAttribute(name: string): string | null {
    return this.attributes[name] ?? null;
  }

  public hasAttribute(name: string): boolean {
    return name in this.attributes;
  }

  public removeAttribute(name: string): void {
    delete this.attributes[name];
  }

  public appendChild(child: SimpleElement): void {
    this.children.push(child);
  }

  public addEventListener(event: string, handler: (e: any) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  public removeEventListener(event: string, handler: (e: any) => void): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((h) => h !== handler);
  }

  public dispatchEvent(event: any): boolean {
    const list = this.listeners[event.type || "click"];
    if (list) {
      for (const h of list) {
        h(event);
      }
    }
    return true;
  }

  public click(): void {
    if (this.disabled) return;
    this.dispatchEvent({ type: "click", target: this });
  }

  public focus(): void {
    this.dispatchEvent({ type: "focus", target: this });
  }
}

export function createElement<T = HTMLElement>(tagName: string): T {
  if (typeof document !== "undefined") {
    return document.createElement(tagName) as unknown as T;
  }
  return new MockElement(tagName) as unknown as T;
}
