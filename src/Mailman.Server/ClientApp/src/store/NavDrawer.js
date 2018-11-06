const openDrawerType = 'OPEN_DRAWER';
const closeDrawerType = 'CLOSE_DRAWER';
const initialState = { drawerOpened: false };

export const actionCreators = {
  open: () => ({ type: openDrawerType }),
  close: () => ({ type: closeDrawerType })
};

export const reducer = (state, action) => {
  state = state || initialState;
  console.log('Tester')
  if (action.type === openDrawerType) {
    return { ...state, drawerOpened: true };
  }

  if (action.type === closeDrawerType) {
    return { ...state, drawerOpened: false };
  }

  return state;
};
