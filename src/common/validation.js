import validator from 'validator';
import iban from 'iban'
import moment from "moment";

export function validate(fieldName, value, rules, messages, label) {
	let result = objectRulesControl(rules[fieldName], value, label);
	messages[fieldName] = result.message;
	return {
		messages: messages,
		valid: checkValid(messages)
	}
}

function checkValid(messages) {
	let valid = true;
	for (var message in messages) {
		if (messages[message] !== '') {
			return false;
		}
	}
	return valid;
}

function objectRulesControl(rules, value, label) {
	let result = {state: true, message: ''};
	for (var rule in rules) {
		let ruleKey = rule;
		let ruleValue = rules[rule];
		result = getValidationResult(ruleKey, ruleValue, value, label);
		if (!result.state) {
			return result;
		}
	}
	return result;
}


export function validateComponent(obj) {
	console.log("validateComponent component==>",obj);
	let error = obj.state.error;
	var refs = obj.refs;
	var isValid = true;
	for (var key in refs) {
		var ref = refs[key];

		// SELECT MENU, DATA'YI PROPS ALTINDA TUTUYOR
		//console.log("ref:",ref);
		if (ref.props) {
			let rule = null;
			let boundary = null;
			let result = null;
			if (ref.props.inputProps && ref.props.inputProps.dataset) {
				rule = ref.props.inputProps.dataset.vdata;
				boundary = ref.props.inputProps.dataset.vlength
				result = validateField(rule, boundary, (ref.props.inputProps.dataset.value === undefined ? '' : ref.props.inputProps.dataset.value));
			} else {
				rule = ref.props.inputProps.vdata;
				boundary = ref.props.inputProps.vlength
				result = validateField(rule, boundary, (ref.props.value === undefined ? '' : ref.props.value));
			}
			error = Object.assign(error, {[key]: result});
			if (!result.valid)
				isValid = false;
		} else {
			let rule = ref.dataset.vdata;
			let boundary = ref.dataset.vlength;
			let result = validateField(rule, boundary, (ref.value === undefined ? '' : ref.value));
			error = Object.assign(error, {[key]: result});
			if (!result.valid)
				isValid = false;
		}

	}
	return {valid: isValid, error: error};
	console.log(isValid,error);
}

export function validateCustom(booleanExpression, message) {
	return {valid: booleanExpression, message: (booleanExpression ? '' : message)};
}

export function validateField(rule, boundary, value) {
	value = (value !== 0 && !value ? '' : value.toString());
	let result = {valid: true, message: ''};
	if (boundary !== undefined) {
		let limit = boundary.split(',');

		if ((parseInt(limit[0]) > 0) && (value.length === 0)) {
			return result = {valid: false, message: ' Alan boş bırakılamaz!'}
		}
		if (parseInt(limit[0]) > value.length) {
			return result = {valid: false, message: ' Alanı en az ' + limit[0] + ' karakterle sınırlandırılmıştır.'}
		}
		if ((parseInt(limit[1]) !== 0) && (parseInt(limit[1]) < value.length)) {
			return result = {valid: false, message: ' Alanı en fazla ' + limit[1] + ' karakterle sınırlandırılmıştır.'}
		}
		else {
			if (rule !== undefined) {
				if (rule.endsWith('Moment')) {
					return result = getValidationResult(rule, boundary, value, '');
				} else {
					return result = getValidationResult(rule, true, value, '');
				}
			}
		}
	} else {
		if (rule !== undefined)
			return result = getValidationResult(rule, true, value, '');

	}
	return result;
}

export function getValidationResult(ruleKey, ruleValue, value, label) {
	let result = {valid: true, message: ''};
	switch (ruleKey) {
		case 'required':
			result.valid = (ruleValue === false ? true : (!validator.isEmpty(value)));
			result.message = result.valid === true ? '' : `${label} alanı zorunludur.`;
			break;
		case 'maxLength':
			result.valid = validator.isLength(value, {max: ruleValue});
			result.message = result.valid === true ? '' : label + ' maksimum ' + ruleValue + ' karakter olmalıdır.';
			break;
		case 'date':
			result.valid = validator.isEmpty(value) || moment(value, "DD-MM-YYYY", true).isValid() || moment(value, "YYYY-MM-DD", true).isValid();
			result.message = result.valid === true ? '' : 'Tarih formatı uygun değil.';
			break;
		case 'year':
			result.valid = validator.isEmpty(value) || moment(value, "YYYY", true).isValid();
			result.message = result.valid === true ? '' : 'Tarih formatı uygun değil.';
			break;
		case 'periodDate':
			result.valid = validator.isEmpty(value) || moment(value, "MM-YYYY", true).isValid() || moment(value, "YYYY-MM", true).isValid();
			result.message = result.valid === true ? '' : 'Dönem formatı uygun değil.';
			break;
		case 'datetime':
			result.valid = validator.isEmpty(value) || moment(value, "DD-MM-YYYY HH:mm:ss", true).isValid();
			result.message = result.valid === true ? '' : 'Tarih formatı GG-AA-YYYY SS:dd:ss biçiminde olmalıdır.';
			break;
		case 'time':
			result.valid = ruleValue === false ? true : (validator.isEmpty(value) ? true : new RegExp(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g).test(value));
			result.message = result.valid === true ? '' : 'Zaman formatı uygun değil.';
			break;
		case 'email':
			// result.valid = ruleValue === false ? true : validator.isEmpty(value) ? true : (validator.isEmail(value) && checkEmailAvailable(value));
			// result.message = result.valid === true ? '' : validator.isEmail(value) === false ? label + 'e-Posta formatı uygun değil.':label + 'e-Posta kullanımdadır.';
			result.valid = ruleValue === false ? true : validator.isEmpty(value) ? true : validator.isEmail(value);
			console.log("validator.isEmail(value)",validator.isEmail(value));
			result.message = result.valid === true ? '' : label + 'e-Posta formatı uygun değil.';

			break;
		case 'url':
			result.valid = ruleValue === false ? true : (validator.isEmpty(value) ? true : new RegExp(/^(http(s){0,1}:\/\/)?([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+.*)$/g).test(value));
			result.message = result.valid === true ? '' : label + 'Url formatı uygun değil.';
			break;
		case 'decimal':
			result.valid = ruleValue === false ? true : validator.isDecimal(value);
			result.message = result.valid === true ? '' : label + 'Sayı formatı uygun değil.';
			break;
		case 'uuid':
			result.valid = ruleValue === false ? true : (validator.isUUID(value));
			result.message = result.valid === true ? '' : label + 'UUID formatı uygun değil.';
			break;
		case 'identifier':
			result.valid = ruleValue === false ? true : (validator.isEmpty(value) ? true : new RegExp(/^(\d{10}|[1-9]\d{10})$/g).test(value));
			result.message = result.valid === true ? '' : label + 'TCKN/VKN formatı uygun değil.';
			break;
		case 'vkn':
			result.valid = ruleValue === false ? true : new RegExp(/^\d{10}$/g).test(value);
			result.message = result.valid === true ? '' : label + 'VKN formatı uygun değil.';
			break;
		case 'iban':
			result.valid = ruleValue === false ? true : (iban.isValid(value));
			result.message = result.valid === true ? '' : label + 'IBAN formatı uygun değil.';
			break;
		case 'urn':
			result.valid = ruleValue === false ? true : (new RegExp(/^urn\:mail\:([_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*)@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/g).test(value))
			result.message = result.valid === true ? '' : label + 'Etiket formatı uygun değil.';
			break;
		case 'integer':
			result.valid = (ruleValue === false ? true : validator.isInt(value))
			result.message = result.valid === true ? '' : label + ' sayısal bir değer olmalıdır.';
			break;
		case 'phone':
			result.valid = ruleValue === false ? true : (new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g).test(value));
			result.message = result.valid === true ? '' : 'Telefon numarası formatı uygun değil.';
			break;
		case 'tckn':
			result.valid = ruleValue === false ? true : (new RegExp(/^[1-9]{1}[0-9]{10}$/).test(value));
			result.message = result.valid === true ? '' : 'TC Kimlik No formatı uygun değil.';
			break;
		case 'hesCode':
			result.valid = ruleValue === false ? true : new RegExp('[A-Z][0-9][A-Z][0-9]-[0-9]{4}-[0-9]{2}$').test(value);
			result.message = result.valid === true ? '' : label + 'HES Kodu formatı uygun değil.';
			break;
		default:
			result = {valid: true, message: ''};
	}
	return result;
}

