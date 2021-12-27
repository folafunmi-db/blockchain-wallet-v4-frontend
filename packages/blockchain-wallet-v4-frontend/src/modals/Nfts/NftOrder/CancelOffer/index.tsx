import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { Remote } from '@core'
import { convertCoinToCoin } from '@core/exchange'
import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Row, Title, Value } from 'components/Flyout/model'
import { Form, NumberBox, SelectBox } from 'components/Form'
import { selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
// import CancelOfferFees from './fees'

const CancelOffer: React.FC<Props> = (props) => {
  const { close, formValues, nftActions, orderFlow } = props
  const { activeOrder } = orderFlow

  const disabled =
    !formValues.amount || Remote.Loading.is(orderFlow.order) || Remote.Loading.is(orderFlow.fees)

  return (
    <>
      {orderFlow.asset.cata({
        Failure: (e) => <Text>{e}</Text>,
        Loading: () => (
          <AssetDesc>
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          </AssetDesc>
        ),
        NotAsked: () => null,
        Success: (val) => (
          <>
            <div style={{ position: 'relative' }}>
              <Icon
                onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.SHOW_ASSET })}
                name='arrow-left'
                cursor
                role='button'
                style={{ left: '40px', position: 'absolute', top: '40px' }}
              />
              <Icon
                onClick={() => close()}
                name='close'
                cursor
                role='button'
                style={{ position: 'absolute', right: '40px', top: '40px' }}
              />
              <FullAssetImage cropped backgroundImage={val?.image_url.replace(/=s\d*/, '')} />
            </div>
            <AssetDesc>
              <Text size='16px' color='grey900' weight={600}>
                {val?.collection?.name}
              </Text>
              <Text style={{ marginTop: '4px' }} size='20px' color='grey900' weight={600}>
                {val?.name}
              </Text>
            </AssetDesc>
            <Row>
              <Title>
                <FormattedMessage id='copy.description' defaultMessage='Description' />
              </Title>
              <Value>
                {val?.description || (
                  <FormattedMessage id='copy.none_found' defaultMessage='None found.' />
                )}
              </Value>
            </Row>
            <Form>
              <Row>
                <Title>
                  <b>
                    <FormattedMessage id='copy.select_coin' defaultMessage='Select Coin' />
                  </b>
                </Title>
                <Value>
                  <Field
                    name='coin'
                    component={SelectBox}
                    elements={[
                      {
                        group: '',
                        items: val.collection.payment_tokens
                          .map((token) => token.symbol)
                          .filter((symbol) => symbol === 'WETH')
                          .map((coin) => ({
                            text: window.coins[coin].coinfig.symbol,
                            value: window.coins[coin].coinfig.symbol
                          }))
                      }
                    ]}
                  />
                </Value>
              </Row>
            </Form>
            {activeOrder ? (
              <StickyCTA>
                {/* <CancelOfferFees {...props} /> */}
                <Button
                  jumbo
                  nature='primary'
                  fullwidth
                  data-e2e='makeOfferNft'
                  disabled={disabled}
                  // onClick={() => nftActions.createOffer({ order: activeOrder, ...formValues })}
                >
                  <FormattedMessage id='copy.cancel_offer' defaultMessage='Cancel Offer' />
                </Button>
              </StickyCTA>
            ) : null}
          </>
        )
      })}
    </>
  )
}

const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues('nftCancelOffer')(state) as {
    amount: string
    coin: string
  }
})

const connector = connect(mapStateToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    form: 'nftCancelOffer',
    initialValues: {
      coin: 'WETH'
    }
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(CancelOffer) as React.FC<OwnProps>
