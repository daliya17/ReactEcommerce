import React from 'react';
import PropTypes from 'prop-types';
import '../style/css/PageHeader.css';
import {
  Breadcrumbs,
  Link,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const LinkRouter = (props: any) => <Link {...props} component={RouterLink} />;

function breadcrumbItem(item: any) {
  if (item.link) {
    return (
      <LinkRouter
        className='page-header__link'
        color="inherit"
        key={item.text}
        to={item.link}
      >
        {item.text}
      </LinkRouter>
    );
  }
  return (
    <Typography
      className='page-header__link'
      color="textPrimary"
      key={item.text}
    >
      {item.text}
    </Typography>
  );
}

function PageHeader(props: any) {
  const { pageActions, title, breadcrumbs } = props;
  return (
    <div className='page-header__items'>
      {breadcrumbs && (
        <Breadcrumbs
          className='page-header__breadcrumps'
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs.map((item: any) => breadcrumbItem(item))}
        </Breadcrumbs>
      )}
      <Toolbar className='page-header__toolbar'>
        <Typography variant="h5" component="div" id='page-header__title'>
          {title}
        </Typography>
        <div className='page-header__divider' />
        <div className='page-header__actions'>{pageActions}</div>
      </Toolbar>
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string,
  pageActions: PropTypes.node,
  classes: PropTypes.object,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      link: PropTypes.string,
    })
  ),
};

export default PageHeader;
