/**
 * PropsArray - A high-performance array-like structure for particle systems
 * Stores particle properties in a flat array for better memory access patterns
 */

export class PropsArray {
  private data: Float32Array
  private propCount: number
  private itemCount: number
  private props: string[]

  constructor(itemCount: number, props: string[]) {
    this.itemCount = itemCount
    this.props = props
    this.propCount = props.length
    this.data = new Float32Array(itemCount * this.propCount)
  }

  // Get a single property value
  get(itemIndex: number, propName: string): number {
    const propIndex = this.props.indexOf(propName)
    if (propIndex === -1) throw new Error(`Property ${propName} not found`)
    return this.data[itemIndex * this.propCount + propIndex]
  }

  // Set a single property value
  setProp(itemIndex: number, propName: string, value: number): void {
    const propIndex = this.props.indexOf(propName)
    if (propIndex === -1) throw new Error(`Property ${propName} not found`)
    this.data[itemIndex * this.propCount + propIndex] = value
  }

  // Get all properties for an item as an array
  getItem(itemIndex: number): number[] {
    const start = itemIndex * this.propCount
    return Array.from(this.data.slice(start, start + this.propCount))
  }

  // Set all properties for an item from an array
  set(values: number[], itemIndex: number): void {
    const start = itemIndex * this.propCount
    for (let i = 0; i < Math.min(values.length, this.propCount); i++) {
      this.data[start + i] = values[i]
    }
  }

  // Iterator for forEach-like functionality
  forEach(callback: (item: number[], index: number) => void): void {
    for (let i = 0; i < this.itemCount; i++) {
      const item = this.getItem(i)
      callback(item, i)
    }
  }

  // Map function that returns a new array
  map<T>(callback: (item: number[], index: number) => T): T[] {
    const result: T[] = []
    this.forEach((item, index) => {
      result.push(callback(item, index))
    })
    return result
  }

  // Direct access to underlying data for performance-critical operations
  getRawData(): Float32Array {
    return this.data
  }

  // Get item count
  getItemCount(): number {
    return this.itemCount
  }

  // Get property names
  getProps(): string[] {
    return [...this.props]
  }
}
