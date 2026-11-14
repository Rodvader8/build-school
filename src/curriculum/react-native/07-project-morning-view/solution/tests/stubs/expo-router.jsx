// A stand-in for expo-router, so screens can be tested without a phone or a real navigator.
// Tests set the route's parameters with setParams({ id: '101' }) and read back what the layout asked for.
let params = {};
export const setParams = (next) => {
  params = next;
};
export const useLocalSearchParams = () => params;
export const router = { push: () => {}, back: () => {} };

export function Link({ href, children, ...rest }) {
  return (
    <a href={typeof href === 'string' ? href : href.pathname} {...rest}>
      {children}
    </a>
  );
}

const options = (value) => JSON.stringify(typeof value === 'function' ? {} : (value ?? {}));

export function Stack({ screenOptions, children }) {
  return (
    <div data-testid="stack" data-options={options(screenOptions)}>
      {children}
    </div>
  );
}
// <Stack.Screen name="..."> declares a screen in a layout. Without a name it sets options for the screen it sits in.
Stack.Screen = function Screen({ name, options: screenOptions }) {
  return <div data-testid={name ? `screen-${name}` : 'screen-options'} data-options={options(screenOptions)} />;
};

export const Slot = () => null;
