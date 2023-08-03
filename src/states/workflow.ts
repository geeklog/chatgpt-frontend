import React, { useReducer } from "react";
import _ from 'lodash';
import { Attachment, ModelType } from "../types";

const templateGenPseudocode = `Read the document and provide the pseudocode, the pseudocode must provide all the details that is needed to know for start a payment request / calculate hash / send api / parse the response / verify response, the pseudocode must be complete and all the information is from the document, the psedocode must be complete and not missing any details. Be very careful don't miss any required parameters/fields, Be very careful do not make up anything. I want the complete psedocode, don't use the words "like, etc"
Put the pseudocode in the code block.`;

const templateRelevantInterface = `As a senior Java programmer, please read the interface definition in the attachment, and extract all the relavant dependencies code for implements a \`public ThirdSubmitResponseBO pay(ThirdSubmitRequestBO requestBO)\` method in the \`PaymentProvider\`.
And all the dependencies for the dependencies, and so on.
You must list all the interfaces and all the fields.
Double check if you missing anything before you response.
Response in JSON.`;

const templateGenJava = `As a senior Java programmer, please convert the pseudocode into real Java code. Giving the Interface definition in json, please help transform the payment request code to a \`EghlProvider\` class that implements the \`public ThirdSubmitResponseBO pay(ThirdSubmitRequestBO requestBO)\` method.
You must provide the full implementation, include but not limited to: low level details, utility code and helper functions, implement details for using libraries for cryptographic hashing, HTTP requests, and URL encoding/decoding. You must be very detailed. Do this line-by-line and not skip any lines of logic or code.

Pseudocode for the \`pay\` method:
\`\`\`pseudocode
{pseudocode}
\`\`\`

API Interface definition in JSON format:
\`\`\`json
{interface_snippets}
\`\`\``

type WorkflowStep = {
  title: string;
  model: ModelType,
  prompt: string;
  attachments: Attachment[],
  output: string;
}

export type Workflow = {
  id: string,
  title: string;
  triggerWords: string,
  steps: WorkflowStep[]
}

type WorkflowAction = {
  updateStep: (i: number, update: Partial<WorkflowStep>) => void,
  addAttachmentInStep: (i: number, attachment: Attachment) => void
}

const fusion1: Workflow = {
  id: 'fusion1',
  title: 'Fusion Payment API Integration to EGHL',
  triggerWords: 'fusion integration',
  steps: [
    {
      title: 'Read EGHL Document, Generate pseudocode',
      model: 'Claude2',
      attachments: [],
      prompt: templateGenPseudocode,
      output: '{pseudocode}'
    },
    {
      title: 'Summarize Fusion API Definition',
      model: 'Claude2',
      attachments: [],
      prompt: templateRelevantInterface,
      output: '{interface_snippets}'
    },
    {
      title: 'Combine results, Generate Java code',
      model: 'ChatGPT',
      attachments: [],
      prompt: templateGenJava,
      output: '{to_chat}'
    },
  ]
}

export const workflows: Record<string, Workflow> = {
  'fusion1': fusion1
};

export function getWorkflowByTriggerWord(triggerWord: string) {
  for (let k of Object.keys(workflows)) {
    if (workflows[k].triggerWords === triggerWord)
      return workflows[k];
  }
  return undefined;
}

const reducer = (state: Record<string, Workflow>, {type, id, workflow}: {type: 'change', id: string, workflow: Workflow}) => {
  switch (type) {
    case 'change':
      workflow = _.cloneDeep(workflow)
      workflows[id] = workflow;
      return {...state, ...{[id]: workflow}};
    default:
      throw new Error();
  }
}

export const useWorkflow = (workflowId: string): [Workflow, WorkflowAction] => {
  const [state, dispatch] = useReducer(reducer, workflows);
  const currentWorkflow = state[workflowId];
  const currentWrokflowHandler = {
    updateStep: (i: number, update: Partial<WorkflowStep>) => {
      currentWorkflow.steps[i] = {...currentWorkflow.steps[i], ...update};
      dispatch({type: 'change', id: workflowId, workflow: currentWorkflow});
    },
    addAttachmentInStep: (i: number, attachment: Attachment) => {
      const update = currentWorkflow.steps[i];
      update.attachments.push(attachment);
      currentWorkflow.steps[i] = {...currentWorkflow.steps[i], ...update};
      dispatch({type: 'change', id: workflowId, workflow: currentWorkflow});
    }
  }
  return [currentWorkflow, currentWrokflowHandler];
}

export const WorkflowContext = React.createContext(workflows);
