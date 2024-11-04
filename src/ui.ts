import { make, makeInputEl } from './utils/dom';
import type { API } from '@editorjs/editorjs';
import type { LaTexToolData, LaTexToolConfig } from './types/types';
import katex from 'katex';

/**
 * Nodes interface representing various elements in the UI.
 */
interface Nodes {
  /**
   * Wrapper element in the UI.
   */
  wrapper: HTMLElement;

  /**
   * Container for the preview element in the UI.
   */
  preview: HTMLElement;

  /**
   * Input element for the LaTex expression.
   */
  input: HTMLInputElement;
}

/**
 * ConstructorParams interface representing parameters for the Ui class constructor.
 */
interface ConstructorParams {
  /**
   * Editor.js API.
   */
  api: API;
  /**
   * Configuration for the LatexTool.
   */
  config: LaTexToolConfig;
  /**
   * Flag indicating if the UI is in read-only mode.
   */
  readOnly: boolean;
}

/**
 * Class for working with UI:
 */
export default class Ui {
  /**
   * Nodes representing various elements in the UI.
   */
  public nodes: Nodes;

  /**
   * API instance for Editor.js.
   */
  private api: API;

  /**
   * Configuration for the LaTex tool.
   */
  private config: LaTexToolConfig;

  /**
   * Flag indicating if the UI is in read-only mode.
   */
  private readOnly: boolean;

  /**
   * @param ui - LaTex tool Ui module
   * @param ui.api - Editor.js API
   * @param ui.config - user config
   * @param ui.readOnly - read-only mode flag
   */
  constructor({ api, config, readOnly }: ConstructorParams) {
    this.api = api;
    this.config = config;
    this.readOnly = readOnly;
    this.nodes = {
      wrapper: make('div', [this.CSS.baseClass, this.CSS.wrapper]),
      preview: make('div', [this.CSS.preview]),
      input: makeInputEl([this.CSS.input], {
        contentEditable: !this.readOnly,
        type: 'text',
        placeHolder:
          this.config.placeholder || 'input your LaTex expression here...',
        disabled: this.readOnly,
        spellcheck: false,
      }),
    };

    /**
     * Create base structure
     *  <wrapper>
     *    <preview>
     *    </preview>
     *    <input />
     *  </wrapper>
     */
    this.nodes.input.dataset.placeholder = this.config.placeholder;
    this.nodes.wrapper.appendChild(this.nodes.preview);
    this.nodes.wrapper.appendChild(this.nodes.input);
    this.nodes.input.addEventListener('keyup', (e) => {
      // Prevent default actions
      e.preventDefault();

      // Render LaTeX expression
      katex.render(this.nodes.input.value, this.nodes.preview, {
        throwOnError: false,
        output: 'mathml',
      });
    });
  }

  /**
   * Apply visual representation of activated tune
   * @param tuneName - one of available tunes {@link Tunes.tunes}
   * @param status - true for enable, false for disable
   */
  public applyTune(tuneName: string, status: boolean): void {
    this.nodes.wrapper.classList.toggle(
      `${this.CSS.wrapper}--${tuneName}`,
      status
    );
  }

  /**
   * Renders tool UI
   * @param toolData - saved tool data
   */
  public render(toolData: LaTexToolData): HTMLElement {
    this.nodes.input.value = toolData.math || '';

    katex.render(this.nodes.input.value, this.nodes.preview, {
      throwOnError: false,
      output: 'mathml',
    });

    return this.nodes.wrapper;
  }

  /**
   * Shows caption input
   * @param text - caption content text
   */
  public fillInput(text: string): void {
    if (this.nodes.input !== undefined) {
      this.nodes.input.value = text;
    }
  }

  /**
   * CSS classes
   */
  private get CSS(): Record<string, string> {
    return {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      button: this.api.styles.button,

      /**
       * Tool's classes
       */
      wrapper: 'latex-tool',
      preview: 'latex-tool__preview',
      input: 'latex-tool__input',
    };
  }
}
