// nodeExporters.ts
import { exportTextNode } from '../components/nodes/TextNode';
import { exportImageNode } from '../components/nodes/ImageNode';
import { exportVideoNode } from '../components/nodes/VideoNode';
import { exportTextInputNode } from '../components/nodes/inputs/TextInputNode';
// ... import other exporters

export const nodeExporters: Record<string, (node: any) => any> = {
  text: exportTextNode,
  image: exportImageNode,
  video: exportVideoNode,
  input_text: exportTextInputNode,
  // ... add other mappings
};
