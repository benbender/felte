import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/dom';
import { createInputElement, createDOM, cleanupDOM } from './common';
import {
  _some,
  _mapValues,
  _get,
  _set,
  _unset,
  _update,
  _isPlainObject,
  deepSet,
  deepSome,
  isFieldSetElement,
  isFormControl,
  isElement,
  getPath,
  getFormControls,
  addAttrsFromFieldset,
  getFormDefaultValues,
  setForm,
} from '../src';

function createLoginForm() {
  const formElement = screen.getByRole('form') as HTMLFormElement;
  const emailInput = createInputElement({ name: 'email', type: 'email' });
  const passwordInput = createInputElement({
    name: 'password',
    type: 'password',
  });
  const submitInput = createInputElement({ type: 'submit' });
  const accountFieldset = document.createElement('fieldset');
  accountFieldset.name = 'account';
  accountFieldset.append(emailInput, passwordInput);
  formElement.append(accountFieldset, submitInput);
  return { formElement, emailInput, passwordInput, submitInput };
}

function createSignupForm() {
  const formElement = screen.getByRole('form') as HTMLFormElement;
  const emailInput = createInputElement({ name: 'email', type: 'email' });
  const passwordInput = createInputElement({
    name: 'password',
    type: 'password',
  });
  const showPasswordInput = createInputElement({
    name: 'showPassword',
    type: 'checkbox',
  });
  const confirmPasswordInput = createInputElement({
    name: 'confirmPassword',
    type: 'password',
  });
  const publicEmailYesRadio = createInputElement({
    name: 'publicEmail',
    value: 'yes',
    type: 'radio',
  });
  const publicEmailNoRadio = createInputElement({
    name: 'publicEmail',
    value: 'no',
    type: 'radio',
  });
  const accountFieldset = document.createElement('fieldset');
  accountFieldset.name = 'account';
  accountFieldset.append(
    emailInput,
    passwordInput,
    showPasswordInput,
    publicEmailYesRadio,
    publicEmailNoRadio,
    confirmPasswordInput
  );
  formElement.appendChild(accountFieldset);
  const profileFieldset = document.createElement('fieldset');
  profileFieldset.name = 'profile';
  const firstNameInput = createInputElement({ name: 'firstName' });
  const lastNameInput = createInputElement({ name: 'lastName' });
  const bioInput = createInputElement({ name: 'bio' });
  profileFieldset.append(firstNameInput, lastNameInput, bioInput);
  formElement.appendChild(profileFieldset);
  const pictureInput = createInputElement({
    name: 'profile.picture',
    type: 'file',
  });
  formElement.appendChild(pictureInput);
  const extraPicsInput = createInputElement({
    name: 'extra.pictures',
    type: 'file',
  });
  extraPicsInput.multiple = true;
  formElement.appendChild(extraPicsInput);
  const submitInput = createInputElement({ type: 'submit' });
  const techCheckbox = createInputElement({
    type: 'checkbox',
    name: 'preferences',
    value: 'technology',
  });
  const filmsCheckbox = createInputElement({
    type: 'checkbox',
    name: 'preferences',
    value: 'films',
  });
  formElement.append(techCheckbox, filmsCheckbox, submitInput);
  return {
    formElement,
    emailInput,
    passwordInput,
    confirmPasswordInput,
    showPasswordInput,
    publicEmailYesRadio,
    publicEmailNoRadio,
    firstNameInput,
    lastNameInput,
    bioInput,
    pictureInput,
    extraPicsInput,
    techCheckbox,
    filmsCheckbox,
    submitInput,
  };
}

describe('Utils', () => {
  test('_some', () => {
    const testObj = {
      username: 'test',
      password: '',
    };
    const truthyResult = _some(
      testObj,
      (value) => typeof value === 'string' && value === 'test'
    );
    expect(truthyResult).toBeTruthy();

    const falsyResult = _some(
      testObj,
      (value) => typeof value === 'string' && value === 'not in object'
    );
    expect(falsyResult).toBeFalsy();
  });

  test('_mapValues', () => {
    const testObj = {
      username: 'test',
      password: '',
    };
    const mapped = _mapValues(testObj, (value) => !!value);
    expect(mapped).toEqual({
      username: true,
      password: false,
    });
  });

  test('_get', () => {
    const testObj = {
      account: {
        username: 'test',
        password: '',
      },
    };

    expect(_get(testObj, 'account.username')).toBe('test');
    expect(_get(testObj, 'account.nonExistent')).toBe(undefined);
    expect(_get(testObj, 'account.nonExistent', 'default')).toBe('default');
  });

  test('_set', () => {
    const testObj: any = {
      account: {
        username: 'test',
        password: '',
      },
    };

    expect(_set(testObj, 'account.password', 'password').account.password).toBe(
      'password'
    );
    expect(_set(testObj, 'account.toExist', 'value').account.toExist).toBe(
      'value'
    );
    expect(
      _set(undefined as any, 'account.toExist', 'value').account.toExist
    ).toBe('value');
  });

  test('_unset', () => {
    const testObj: any = {
      account: {
        username: 'test',
        password: '',
      },
    };

    expect(_unset(testObj, 'account.password').account.password).toBe(
      undefined
    );
    expect(_unset(testObj, 'account.noExist').account.noExist).toBe(undefined);
  });

  test('_update', () => {
    const testObj: any = {
      account: {
        username: 'test',
        password: '',
      },
    };
    expect(
      _update(testObj, 'account.password', () => 'password').account.password
    ).toBe('password');
    expect(
      _update(testObj, 'account.toExist', () => 'value').account.toExist
    ).toBe('value');
  });

  test('_isPlainObject', () => {
    expect(_isPlainObject({})).toBeTruthy();
    expect(_isPlainObject('')).toBeFalsy();
    expect(_isPlainObject(() => undefined)).toBeFalsy();
    expect(_isPlainObject(1)).toBeFalsy();
    expect(_isPlainObject(true)).toBeFalsy();
  });

  test('deepSet', () => {
    const testObj = {
      account: {
        username: 'test',
        password: '',
      },
    };

    expect(deepSet(testObj, true)).toEqual({
      account: {
        username: true,
        password: true,
      },
    });
  });

  test('deepSome', () => {
    const testObj = {
      account: {
        username: 'test',
        password: '',
      },
    };
    const truthyResult = deepSome(
      testObj,
      (value) => typeof value === 'string' && value === 'test'
    );
    expect(truthyResult).toBeTruthy();

    const falsyResult = deepSome(
      testObj,
      (value) => typeof value === 'string' && value === 'not in object'
    );
    expect(falsyResult).toBeFalsy();
  });

  test('isFieldSetElement', () => {
    expect(isFieldSetElement(document.createElement('fieldset'))).toBeTruthy();
    expect(isFieldSetElement(document.createElement('input'))).toBeFalsy();
  });

  test('isFormControl', () => {
    expect(isFormControl(document.createElement('fieldset'))).toBeFalsy();
    expect(isFormControl(document.createElement('input'))).toBeTruthy();
    expect(isFormControl(document.createElement('textarea'))).toBeTruthy();
    expect(isFormControl(document.createElement('select'))).toBeTruthy();
  });

  test('isElement', () => {
    expect(isElement(document.createTextNode(''))).toBeFalsy();
    expect(isElement(document.createElement('input'))).toBeTruthy();
    expect(isElement(document.createElement('textarea'))).toBeTruthy();
    expect(isElement(document.createElement('select'))).toBeTruthy();
  });

  test('getPath', () => {
    const inputElement = document.createElement('input');
    inputElement.name = 'test';
    expect(getPath(inputElement)).toBe('test');
    inputElement.setAttribute('data-felte-fieldset', 'container');
    expect(getPath(inputElement)).toBe('container.test');
  });

  test('getFormControls', () => {
    createDOM();
    const { formElement } = createLoginForm();
    expect(getFormControls(formElement)).toHaveLength(3);
    cleanupDOM();
  });

  test('addAttrsFromFieldset', () => {
    const fieldset = document.createElement('fieldset');
    fieldset.name = 'container';
    const fieldsetUnset = document.createElement('fieldset');
    fieldsetUnset.name = 'containerUnset';
    fieldsetUnset.setAttribute('data-felte-unset-on-remove', 'true');
    const inputElement = createInputElement({ name: 'test' });
    fieldset.appendChild(inputElement);
    const inputUnsetElement = createInputElement({ name: 'test' });
    fieldsetUnset.appendChild(inputUnsetElement);

    addAttrsFromFieldset(fieldset);
    expect(inputElement).toHaveAttribute('data-felte-fieldset', 'container');

    addAttrsFromFieldset(fieldsetUnset);
    expect(inputUnsetElement).toHaveAttribute(
      'data-felte-fieldset',
      'containerUnset'
    );
    expect(inputUnsetElement).toHaveAttribute(
      'data-felte-unset-on-remove',
      'true'
    );
  });

  test('getFormDefaultValues', () => {
    createDOM();
    const { formElement } = createSignupForm();

    const { defaultData } = getFormDefaultValues(formElement);
    expect(defaultData).toEqual(
      expect.objectContaining({
        account: {
          email: '',
          password: '',
          confirmPassword: '',
          showPassword: false,
          publicEmail: undefined,
        },
        profile: {
          firstName: '',
          lastName: '',
          bio: '',
          picture: undefined,
        },
        extra: {
          pictures: expect.arrayContaining([]),
        },
        preferences: expect.arrayContaining([]),
      })
    );
    cleanupDOM();
  });

  test('setForm', () => {
    createDOM();
    const formData = {
      account: {
        email: 'jacek@soplica.com',
        password: 'password',
        confirmPassword: 'password',
        showPassword: true,
        publicEmail: 'yes',
      },
      profile: {
        firstName: 'Jacek',
        lastName: 'Soplica',
        bio: 'bio',
        picture: undefined,
      },
      extra: {
        pictures: [],
      },
      preferences: ['technology'],
    };
    const { formElement } = createSignupForm();

    setForm(formElement, formData);
    const { defaultData } = getFormDefaultValues(formElement);
    expect(defaultData).toEqual(formData);
    cleanupDOM();
  });
});