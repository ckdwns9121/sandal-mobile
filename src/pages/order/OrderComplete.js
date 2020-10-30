import React from 'react';
import OrderCompleteContainer from 'containers/order/OrderCompleteContainer';
import qs from 'qs';
import { Paths } from '../../paths';

export default function OrderComplete({ location, match }) {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });

    const { order_number, message } = query;
    if (message && message.indexOf('결제를 종료하였습니다.') !== -1) {
        alert('결제를 종료하였습니다.');
        window.location = Paths.ajoonamu.order;
    } else if (message && message.indexOf('한도가 초과하였습니다') !== -1) {
        alert('한도를 초과하였습니다.');
        window.location = Paths.ajoonamu.order;
    } else if (message && message.indexOf('카드인증완료') !== -1) {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            localStorage.removeItem('noAuthCartId');
        }
    }
    return <OrderCompleteContainer order_number={order_number} modal={match.params.modal} query={location.search} />;
}
