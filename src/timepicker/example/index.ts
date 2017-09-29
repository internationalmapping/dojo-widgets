import { getDateFormatter } from '@dojo/i18n/date';
import { DNode } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import setLocaleData from './setLocaleData';
import TimePicker, { TimeUnits } from '../TimePicker';
import dojoTheme from '../../themes/dojo/theme';
import * as baseCss from '../../common/styles/base.m.css';

setLocaleData();

const TODAY = new Date();
const getEnglishTime = getDateFormatter({ time: 'short' });

@theme(baseCss)
export class App extends ThemeableMixin(WidgetBase)<ThemeableProperties> {
	private _theme: {};
	private _options: TimeUnits[];
	private _values: any = {};
	private _invalid = false;

	onRequestOptions(value: string, options: TimeUnits[]) {
		this._options = options;
		this.invalidate();
	}

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	private _setValue(key: string, value: string) {
		this._values[key] = value;
		this.invalidate();
	}

	render(): DNode {
		return v('div', [
			v('h1', [ 'TimePicker Examples' ]),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),

			v('p', {
				id: 'description1',
				classes: this.classes().fixed(baseCss.visuallyHidden)
			}, [ 'Accepts 24-hour time with a leading zero, rounded to the nearest half hour.' ]),

			v('h3', [ 'Filter options on input' ]),
			w(TimePicker, {
				inputProperties: {
					describedBy: 'description1',
					placeholder: 'Enter a value'
				},
				key: '1',
				onChange: (value: string) => {
					this._setValue('value1', value);
				},
				onRequestOptions: (value: string, options: TimeUnits[]) => {
					if (!value) {
						this._options = options;
					}
					else {

						const matching = options.filter(option => {
							const { hour, minute = 0 } = option;
							const hours = hour >= 10 ? hour : `0${hour}`;
							const minutes = minute >= 10 ? minute : `0${minute}`;
							return `${hours}:${minutes}`.indexOf(value) === 0;
						});

						this._options = matching.length ? matching : options;
					}
					this.invalidate();
				},
				options: this._options,
				step: 1800,
				theme: this._theme,
				value: this._values['value1']
			}),

			v('h3', [ 'Open on focus' ]),
			w(TimePicker, {
				inputProperties: {
					describedBy: 'description1',
					placeholder: 'Enter a value'
				},
				key: '2',
				openOnFocus: true,
				onChange: (value: string) => {
					this._setValue('value2', value);
				},
				onRequestOptions: this.onRequestOptions,
				options: this._options,
				step: 1800,
				theme: this._theme,
				value: this._values['value2']
			}),

			v('h3', [ 'Disabled menu items' ]),
			v('p', {
				id: 'description2',
				classes: this.classes().fixed(baseCss.visuallyHidden)
			}, [ 'Accepts 24-hour time with a leading zero, rounded to the nearest hour.' ]),
			w(TimePicker, {
				inputProperties: {
					describedBy: 'description2',
					placeholder: 'Enter a value'
				},
				isOptionDisabled: (option: TimeUnits) => option.hour >= 12,
				key: '3',
				onChange: (value: string) => {
					this._setValue('value3', value);
				},
				onRequestOptions: this.onRequestOptions,
				options: this._options,
				step: 3600,
				theme: this._theme,
				value: this._values['value3']
			}),

			v('h3', [ 'Disabled' ]),
			w(TimePicker, {
				inputProperties: {
					describedBy: 'description1',
					placeholder: 'Enter a value'
				},
				key: '4',
				disabled: true,
				theme: this._theme
			}),

			v('h3', [ 'Read Only' ]),
			w(TimePicker, {
				inputProperties: {
					describedBy: 'description1',
					placeholder: 'Enter a value'
				},
				key: '5',
				readOnly: true,
				theme: this._theme
			}),

			v('h3', [ 'Label' ]),
			w(TimePicker, {
				key: '6',
				inputProperties: {
					describedBy: 'description1'
				},
				label: 'Enter a value',
				onChange: (value: string) => {
					this._setValue('value6', value);
				},
				onRequestOptions: this.onRequestOptions,
				options: this._options,
				step: 1800,
				theme: this._theme,
				value: this._values['value6']
			}),

			v('h3', [ 'Required and validated' ]),
			w(TimePicker, {
				inputProperties: {
					describedBy: 'description1',
					placeholder: 'Enter a value'
				},
				invalid: this._invalid,
				key: '7',
				required: true,
				onBlur: (value: string) => {
					this._invalid = value.trim().length === 0;
					this.invalidate();
				},
				onChange: (value: string) => {
					this._invalid = value.trim().length === 0;
					this._setValue('value7', value);
				},
				onRequestOptions: this.onRequestOptions,
				options: this._options,
				step: 1800,
				theme: this._theme,
				value: this._values['value7']
			}),

			v('h3', [ 'One second increment' ]),
			v('p', {
				id: 'description8',
				classes: this.classes().fixed(baseCss.visuallyHidden)
			}, [ 'Accepts 24-hour time with a leading zero, rounded to the nearest second.' ]),
			w(TimePicker, {
				end: '12:00:59',
				inputProperties: {
					describedBy: 'description8',
					placeholder: 'Enter a value'
				},
				key: '8',
				options: this._options,
				onChange: (value: string) => {
					this._setValue('value8', value);
				},
				onRequestOptions: this.onRequestOptions,
				start: '12:00:00',
				step: 1,
				theme: this._theme,
				value: this._values['value8']
			}),

			v('h3', [ 'Use 12-hour time' ]),
			v('p', {
				id: 'description9',
				classes: this.classes().fixed(baseCss.visuallyHidden)
			}, [ 'Accepts 12-hour time without a leading zero, rounded to the nearest half hour.' ]),
			w(TimePicker, {
				getOptionLabel: (option: TimeUnits) => {
					TODAY.setHours(option.hour);
					TODAY.setMinutes(option.minute as number);
					return getEnglishTime(TODAY);
				},
				inputProperties: {
					describedBy: 'description9',
					placeholder: 'Enter a value'
				},
				key: '9',
				onChange: (value: string) => {
					this._setValue('value9', value );
				},
				onRequestOptions: this.onRequestOptions,
				options: this._options,
				step: 1800,
				theme: this._theme,
				value: this._values['value9']
			}),

			v('h3', [ 'Native `<input type="time">`' ]),
			w(TimePicker, {
				key: '10',
				inputProperties: {
					describedBy: 'description',
					placeholder: 'Enter a value'
				},
				onChange: (value: string) => {
					this._setValue('value10', value);
				},
				step: 1800,
				theme: this._theme,
				useNativeElement: true,
				invalid: true,
				label: 'foo',
				value: this._values['value10']
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
