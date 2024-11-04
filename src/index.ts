/**
 * Latex Tool for the Editor.js
 * @author leon6002 <gulongchen1@gmail.com>
 * @license MIT
 * @see {@link https://github.com/leon6002/EditorJS-LaTeX}
 *
 */

import type { TunesMenuConfig } from '@editorjs/editorjs/types/tools';
import type {
  API,
  ToolboxConfig,
  BlockToolConstructorOptions,
  BlockTool,
  BlockAPI,
} from '@editorjs/editorjs';
import './index.css';

import Ui from './ui';

import { IconAddBorder, IconStretch, IconHidden } from '@codexteam/icons';
import type {
  ActionConfig,
  LaTexToolData,
  LaTexToolConfig,
  FeaturesConfig,
} from './types/types';

type LaTexToolConstructorOptions = BlockToolConstructorOptions<
  LaTexToolData,
  LaTexToolConfig
>;

/**
 * Implementation of LaTexTool class
 */
export default class LaTexTool implements BlockTool {
  /**
   * Editor.js API instance
   */
  private api: API;

  /**
   * Current Block API instance
   */
  private block: BlockAPI;

  /**
   * Configuration for the LaTexTool
   */
  private config: LaTexToolConfig;

  /**
   * UI module instance
   */
  private ui: Ui;

  /**
   * Stores current block data internally
   */
  private _data: LaTexToolData;

  /**
   * @param tool - tool properties got from editor.js
   * @param tool.data - previously saved data
   * @param tool.config - user config for Tool
   * @param tool.api - Editor.js API
   * @param tool.readOnly - read-only mode flag
   * @param tool.block - current Block API
   */
  constructor({
    data,
    config,
    api,
    readOnly,
    block,
  }: LaTexToolConstructorOptions) {
    this.api = api;
    this.block = block;

    /**
     * Tool's initial config
     */
    this.config = {
      placeholder: this.api.i18n.t(
        config.placeholder ?? 'input your LaTex here...'
      ),
      actions: config.actions,
      features: config.features || {
        border: true,
        stretch: false,
        hideInput: true,
      },
    };

    /**
     * Module for working with UI
     */
    this.ui = new Ui({
      api,
      config: this.config,
      readOnly,
    });

    /**
     * Set saved state
     */
    this._data = {
      math: '',
      withBorder: false,
      stretched: false,
      hideInput: false,
    };
    this.data = data;
  }

  /**
   * Notify core that read-only mode is supported
   */
  public static get isReadOnlySupported(): boolean {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   */
  public static get toolbox(): ToolboxConfig {
    return {
      icon: '<svg id="Layer_1" enable-background="new 0 0 506.1 506.1" height="512" viewBox="0 0 506.1 506.1" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m489.609 0h-473.118c-9.108 0-16.491 7.383-16.491 16.491v473.118c0 9.107 7.383 16.491 16.491 16.491h473.119c9.107 0 16.49-7.383 16.49-16.491v-473.118c0-9.108-7.383-16.491-16.491-16.491zm-16.49 473.118h-440.138v-440.137h440.138z"/><path d="m367.278 240.136v-62.051c0-8.836-7.163-16-16-16s-16 7.164-16 16v147.377c0 15.024 18.993 21.77 28.457 10.03 34.691 18.107 77.146-6.988 77.146-46.831.001-37.966-39-63.416-73.603-48.525zm20.802 69.327c-11.47 0-20.802-9.332-20.802-20.802s9.332-20.802 20.802-20.802 20.802 9.332 20.802 20.802-9.332 20.802-20.802 20.802z"/><path d="m112.397 200.262h-14.014c-8.836 0-16 7.164-16 16s7.164 16 16 16h14.014c8.291 0 15.037 6.746 15.037 15.037v4.998c-30.589-10.389-62.216 12.536-62.216 44.609 0 34.402 35.954 57.331 67.13 42.629 10.128 9.747 27.086 2.537 27.086-11.521v-80.715c0-25.936-21.101-47.037-47.037-47.037zm-.071 111.752c-8.331 0-15.108-6.777-15.108-15.108s6.777-15.108 15.108-15.108 15.108 6.777 15.108 15.108-6.778 15.108-15.108 15.108z"/><path d="m287.786 243.114c-6.248-6.248-16.379-6.249-22.627 0l-18.11 18.11-18.11-18.11c-6.249-6.249-16.379-6.249-22.627 0-6.249 6.249-6.249 16.379 0 22.627l18.11 18.11-18.11 18.11c-6.248 6.248-6.248 16.379 0 22.627s16.378 6.249 22.627 0l18.11-18.11 18.11 18.11c6.246 6.248 16.377 6.249 22.627 0 6.249-6.249 6.249-16.379 0-22.627l-18.11-18.11 18.11-18.11c6.249-6.248 6.249-16.379 0-22.627z"/></svg>',
      title: 'Math',
    };
  }

  /**
   * Available tune tools
   */
  public static get tunes(): Array<ActionConfig> {
    return [
      {
        name: 'hideInput',
        icon: IconHidden,
        title: 'Hide input',
        toggle: true,
      },
      {
        name: 'withBorder',
        icon: IconAddBorder,
        title: 'With border',
        toggle: true,
      },
      {
        name: 'stretched',
        icon: IconStretch,
        title: 'Stretch',
        toggle: true,
      },
    ];
  }

  /**
   * Renders Block content
   */
  public render(): HTMLDivElement {
    return this.ui.render(this.data) as HTMLDivElement;
  }

  /**
   * Validate data: check if latex value exists
   * @param savedData — data received after saving
   * @returns false if saved data is not correct, otherwise true
   */
  public validate(savedData: LaTexToolData): boolean {
    return !!savedData.math;
  }

  /**
   * Return Block data
   */
  public save(blockContent: HTMLElement): LaTexToolData {
    // @ts-ignore
    this._data.math = blockContent.childNodes[1].value;

    return this.data;
  }

  /**
   * Returns configuration for block tunes
   * @returns TunesMenuConfig
   */
  public renderSettings(): TunesMenuConfig {
    const tunes = LaTexTool.tunes.concat(this.config.actions || []);
    const featureTuneMap: Record<string, string> = {
      hideInput: 'hideInput',
      border: 'withBorder',
      stretch: 'stretched',
    };

    const availableTunes = tunes.filter((tune) => {
      const featureKey = Object.keys(featureTuneMap).find(
        (key) => featureTuneMap[key] === tune.name
      );

      return (
        featureKey == null ||
        this.config.features?.[featureKey as keyof FeaturesConfig] !== false
      );
    });

    return availableTunes.map((tune) => ({
      icon: tune.icon,
      label: this.api.i18n.t(tune.title),
      name: tune.name,
      toggle: tune.toggle,
      isActive: this.data[tune.name as keyof LaTexToolData] as boolean,
      onActivate: () => {
        /** If it'a user defined tune, execute it's callback stored in action property */
        if (typeof tune.action === 'function') {
          tune.action(tune.name);

          return;
        }
        this.tuneToggled(tune.name as keyof LaTexToolData);
      },
    }));
  }

  /**
   * Stores all Tool's data
   * @param data - data in LaTex Tool format
   */
  private set data(data: LaTexToolData) {
    this._data.math = data.math || '';
    this.ui.fillInput(this._data.math);

    LaTexTool.tunes.forEach(({ name: tune }) => {
      const value =
        typeof data[tune as keyof LaTexToolData] !== 'undefined'
          ? data[tune as keyof LaTexToolData] === true ||
            data[tune as keyof LaTexToolData] === 'true'
          : false;

      this.setTune(tune as keyof LaTexToolData, value);
    });
  }

  /**
   * Return Tool data
   */
  private get data(): LaTexToolData {
    return this._data;
  }

  /**
   * Callback fired when Block Tune is activated
   * @param tuneName - tune that has been clicked
   */
  private tuneToggled(tuneName: keyof LaTexToolData): void {
    // inverse tune state
    this.setTune(tuneName, !(this._data[tuneName] as boolean));

    // reset caption on toggle
    if (tuneName === 'math' && !this._data[tuneName]) {
      this._data.math = '';
      this.ui.fillInput('');
    }
  }

  /**
   * Set one tune
   * @param tuneName - {@link Tunes.tunes}
   * @param value - tune state
   */
  private setTune(tuneName: keyof LaTexToolData, value: boolean): void {
    (this._data[tuneName] as boolean) = value;

    this.ui.applyTune(tuneName, value);
    if (tuneName === 'stretched') {
      /**
       * Wait until the API is ready
       */
      Promise.resolve()
        .then(() => {
          this.block.stretched = value;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
}
