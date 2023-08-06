import { ReactElement } from 'react';
import { Root, Loader, Modal } from '@athena/forge';
import { useDispatch, useSelector } from 'react-redux';
import '../src/style/css/App.css';
import { BrowserRouter } from 'react-router-dom';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import AppRouter from './router/AppRouter';
import ApplicationBar from './components/ApplicationBar';
import { makeStyles } from '@material-ui/core';
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { selectLoad, selectModal, selectModalText, toggleModal } from './slice/AppSlice';



const useStyles = makeStyles((theme) => ({
  bindMuiToAgGrid: {
    '--ag-material-primary-color': theme.palette.primary.main,
    '--ag-material-accent-color': theme.palette.secondary.main,
  },
}));


function App(): ReactElement {
  const classes = useStyles();
  const load: string = useSelector(selectLoad);
  const showModal: boolean = useSelector(selectModal);
  const modalMessage: string = useSelector(selectModalText);
  const dispatch: Dispatch<AnyAction> = useDispatch();


  return (
    <Root className='height-width--100'>
      <Loader loading={load === 'loading'} text="Loading..." className='height-width--100'>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <ApplicationBar />
          <main className={'height-width--100 ag-theme-material ' + classes.bindMuiToAgGrid}>
            <AppRouter />
            <Modal show={showModal} headerText="Alert!" width="small" onHide={() => dispatch(toggleModal(''))} onPrimaryClick={() => dispatch(toggleModal(''))} disableClose={true}>
              {modalMessage}
            </Modal>
          </main>
        </BrowserRouter>
      </Loader>
    </Root>
  );
}

export default App;
