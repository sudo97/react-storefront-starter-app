import React, { useContext } from 'react'
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography'
import Row from 'react-storefront/Row'
import clsx from 'clsx'
import CartItem from '../components/cart/CartItem'
import { createLazyProps, fetchFromAPI } from 'react-storefront/props'
import { Grid, Hidden, Divider, Container, Button } from '@mui/material'
import { price } from 'react-storefront/utils/format'
import Spacer from 'react-storefront/Spacer'
import Link from 'react-storefront/link/Link'
import { Hbox } from 'react-storefront/Box'
import SessionContext from 'react-storefront/session/SessionContext'
import get from 'lodash/get'

const PREFIX = 'cart';

const classes = {
  root: `${PREFIX}-root`,
  checkoutPanel: `${PREFIX}-checkoutPanel`,
  total: `${PREFIX}-total`,
  checkoutButton: `${PREFIX}-checkoutButton`,
  docked: `${PREFIX}-docked`
};

const StyledContainer = styled(Container)((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    paddingBottom: '64px',
  },

  [`& .${classes.checkoutPanel}`]: {
    backgroundColor: theme.palette.grey['200'],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
  },

  [`& .${classes.total}`]: {
    fontWeight: 'bold',
  },

  [`& .${classes.checkoutButton}`]: {
    width: '100%',
  },

  [`& .${classes.docked}`]: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.subtitle1.fontSize,
      padding: theme.spacing(2),
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      zIndex: 10,
      borderRadius: '0',
      boxShadow: 'none',
    },
  }
}));

export default function Cart(props) {

  const { session, actions } = useContext(SessionContext)
  const items = get(session, 'cart.items')

  const handleUpdateQuantity = (product, quantity) => {
    actions.updateCart({
      item: product,
      quantity,
    })
  }

  const handleRemove = product => {
    actions.removeCartItem({
      item: product,
    })
  }

  return (
    <StyledContainer className={classes.root}>
      <Row>
        <Typography variant="h6">
          My Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </Typography>
      </Row>
      <Row>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={8}>
            {items.length ? (
              items.map((product, i) => (
                <CartItem
                  key={product.id}
                  updateQuantity={handleUpdateQuantity}
                  remove={handleRemove}
                  product={product}
                />
              ))
            ) : (
              <Typography variant="body1">There are no items in your cart.</Typography>
            )}
          </Grid>
          {items.length === 0 ? null : (
            <Grid item xs={12} sm={4}>
              <div className={classes.checkoutPanel}>
                <Hbox alignItems="flex-start">
                  <div>
                    <Typography variant="subtitle2" className={classes.total}>
                      Estimated Total
                    </Typography>
                    <Typography variant="caption">Tax calculated in checkout</Typography>
                  </div>
                  <Spacer />
                  <Typography variant="subtitle2" className={classes.total}>
                    {price(
                      items.reduce((a, b) => a + b.quantity * parseFloat(b.price), 0),
                      { currency: get(session, 'currency') }
                    )}
                  </Typography>
                </Hbox>
                <Hidden smDown implementation="css">
                  <Row>
                    <Divider />
                  </Row>
                </Hidden>
                {items.length === 0 ? null : (
                  <Link href="/checkout">
                    <Button
                      color="primary"
                      variant="contained"
                      className={clsx(classes.checkoutButton, classes.docked)}
                    >
                      Checkout
                    </Button>
                  </Link>
                )}
              </div>
            </Grid>
          )}
        </Grid>
      </Row>
    </StyledContainer>
  );
}

Cart.getInitialProps = createLazyProps(fetchFromAPI)
