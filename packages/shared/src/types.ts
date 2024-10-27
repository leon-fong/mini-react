export interface ReactElementType {
  type: string | "TEXT_ELEMENT" | Function
  props: Record<string, any>
}
