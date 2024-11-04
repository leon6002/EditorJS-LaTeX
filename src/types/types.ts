/**
 * User configuration of LaTex block tunes. Allows to add custom tunes through the config
 */
export interface ActionConfig {
  /**
   * The name of the tune.
   */
  name: string;

  /**
   * The icon for the tune. Should be an SVG string.
   */
  icon: string;

  /**
   * The title of the tune. This will be displayed in the UI.
   */
  title: string;

  /**
   * An optional flag indicating whether the tune is a toggle (true) or not (false).
   */
  toggle?: boolean;

  /**
   * An optional action function to be executed when the tune is activated.
   */
  action?: Function;
}

/**
 * LaTexToolData type representing the input and output data format for the latex tool, including optional custome actions.
 */
export type LaTexToolData<Actions = {}> = {
  /**
   * The LaTex value to be rendered in the editor.
   */
  math: string;

  /**
   * Flag indicating whether the Latex preview has a border.
   */
  withBorder: boolean;

  /**
   * Flag indicating whether the to hide the input element.
   */
  hideInput: boolean;

  /**
   * Flag indicating whether the ui is stretched.
   */
  stretched: boolean;
} & (Actions extends Record<string, boolean> ? Actions : {});

/**
 * @description Allows to enable or disable features.
 */
export type FeaturesConfig = {
  /**
   * Flag to enable/disable tune - border.
   */
  border?: boolean;
  /**
   * Flag to enable/disable tune - hideInput.
   * this tune toggles display state of input element.
   */
  hideInput?: boolean;
  /**
   * Flag to enable/disable tune - stretched
   */
  stretch?: boolean;
};

/**
 *
 * @description Config supported by Tool
 */
export interface LaTexToolConfig {
  /**
   * Placeholder text for the input field.
   */
  placeholder?: string;

  /**
   * Additional actions for the tool.
   */
  actions?: ActionConfig[];

  /**
   * Tunes to be enabled.
   */
  features?: FeaturesConfig;
}
