import { exportTextNode } from '../components/nodes/TextNode';
import { exportImageNode } from '../components/nodes/ImageNode';
import { exportVideoNode } from '../components/nodes/VideoNode';
import { exportStartNode } from '../components/nodes/StartNode';
import { exportAudioNode } from '../components/nodes/AudioNode';
import { exportTextInputNode } from '../components/nodes/inputs/TextInputNode';
import { exportButtonsInputNode } from '../components/nodes/inputs/ButtonsInputNode';
import { exportDateInputNode } from '../components/nodes/inputs/DateInputNode';
import { exportEmailInputNode } from '../components/nodes/inputs/EmailInputNode';
import { exportNumberInputNode } from '../components/nodes/inputs/NumberInputNode';
import { exportPhoneInputNode } from '../components/nodes/inputs/PhoneInputNode';
import { exportPicChoiceInputNode } from '../components/nodes/inputs/PicChoiceInputNode';
import { exportWaitInputNode } from '../components/nodes/inputs/WaitInputNode';
import { exportWebsiteInputNode } from '../components/nodes/inputs/WebsiteInputNode';

export const nodeExporters: Record<string, (node: any) => any> = {
  text: exportTextNode,
  image: exportImageNode,
  video: exportVideoNode,
  start: exportStartNode,
  audio: exportAudioNode,
  input_text: exportTextInputNode,
  input_buttons: exportButtonsInputNode,
  input_date: exportDateInputNode,
  input_email: exportEmailInputNode,
  input_number: exportNumberInputNode,
  input_phone: exportPhoneInputNode,
  input_pic_choice: exportPicChoiceInputNode,
  input_wait: exportWaitInputNode,
  input_website: exportWebsiteInputNode,
};
