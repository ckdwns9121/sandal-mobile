import React, { useCallback, useEffect, useReducer, useState } from 'react';
import styles from './HomeSlick.module.scss';
import Slider from 'react-slick';

import { useModal } from '../../../hooks/useModal';
import { requestBannerList } from '../../../api/event/banner';
import { Link } from 'react-router-dom';
import { DBImageFormat } from '../../../lib/formatter';

const HomeSlick = () => {
    const openModal = useModal();
    
    const [state, dispatch] = useReducer((state, action) => ({ ...state, ...action }), {
        oldSlide: 0, activeSlide: 1, end: 0
    })

    const [list, setList] = useState([]);


    const getBannerList = useCallback(async () => {
        try {
            const res = await requestBannerList();
            console.log(res);
            if (res.data.msg === '성공') {
                setList(res.data.query);
                dispatch({ end: res.data.query.length });
            } else {
                openModal(
                    '배너를 가지고 오는데 오류가 발생했습니다.',
                    '페이지를 새로고침 해 주세요.',
                );
            }
        } catch (e) {
            openModal(
                '배너를 가지고 오는데 오류가 발생했습니다.',
                '페이지를 새로고침 해 주세요.',
            );
        }
    }, [openModal]);

    useEffect(() => {
        getBannerList();
    }, [getBannerList]);

    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,

        appendDots: (dots) => <ul>{dots}</ul>,
        beforeChange: (current, next) => dispatch({ oldSlide: current, activeSlide: next + 1 }),
    };

    return (
        <div className={styles['container']}>
            <Slider {...settings}>
                {list.map(item => (
                    <Link key={item.id} to={item.bn_url}>
                        <div className={styles['item']}>
                            <img src={DBImageFormat(item.bn_img_mobile)[0]} alt="mainBanner" />
                        </div>
                    </Link>
                ))}
            </Slider>
            <div className={styles['count']}>
                <span>{state.activeSlide}</span>
                <span>{state.end}</span>
            </div>
        </div>
    );
};

export default HomeSlick;
