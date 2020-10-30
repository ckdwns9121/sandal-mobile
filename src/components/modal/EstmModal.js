import React, { useReducer, useCallback, useState } from 'react';
import classNames from 'classnames/bind';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { requestPostEstimate } from '../../api/order/estimate';

import Estimate from '../asset/Estimate';
import { ButtonBase } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';

import styles from './EstmModal.module.scss';
import { isEmailForm } from '../../lib/formatChecker';
import { useModal } from '../../hooks/useModal';
import Loading from '../asset/Loading';
import SDGothicNEO_R from './AppleSDGothicNeoR';
import SDGothicNEO_B from './AppleSDGothicNeoB';
import { useSelector } from 'react-redux';
import { numberFormat } from '../../lib/formatter';


const cx = classNames.bind(styles);

const useStyles = makeStyles(() => ({
    container: {
        paddingBottom: '60px',
    },
    appBar: {
        position: 'relative',
        textAlign: 'center',
        backgroundColor: 'white',
        color: 'black',
        boxShadow: 'none',
        borderBottom: 'solid 1px #aaa',
        fontSize: 10,
    },
    title: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 0,
        paddingLeft: 24,
        paddingRight: 24,
        flex: '0 0 auto',
    },
    estimate: {
        marginTop: 48,
        marginBottom: 73,
        paddingBottom: 73,
    },
    estimatePreview: {
        width: '100%',
    },
    sub: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    close: {
        position: 'absolute',
        width: '40px', height: '40px',
        left: 14, zIndex: 2100
    },
}));

const reducer = (state, action) => ({
    ...state,
    [action.name]: action.value,
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EstmModal = (props) => {
    const classes = useStyles();
    const openModal = useModal();

    const { company } = useSelector(state => state.company);
    const { com_name, addr1, addr2, ceo_name, tel, business_num } = company;

    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useReducer(reducer, {
        receiver: '',
        receiver_email: '',
    });
    const [estmFile, setEstmFile] = useState(null);

    const onStateChange = useCallback(e => dispatch(e.target), []);
    const sendEstimate = useCallback(async () => {
        console.log(props.total);
        if (props.total > company.minimum_order) {
            
            if (estmFile) {
                if (isEmailForm(state.receiver_email)) {
                    const token = localStorage.getItem('access_token');
                    setLoading(true);
                    try {
                        const { receiver, receiver_email } = state;
                        const res = await requestPostEstimate(token, {
                            estm_email: receiver_email,
                            estm_username: receiver,
                            estm_file: estmFile,
                        });
                        if (res.data.msg === "성공") {
                            openModal('성공적으로 전송되었습니다!', '이메일을 확인해 주세요!');    
                            props.onClick();
                        } else {
                            openModal('전송이 실패했습니다.', '다시 시도해 주세요.');
                        }
                    } catch (e) {
                        openModal('예기치 못한 에러가 발생했습니다!', '다시 시도해 주세요.');
                    }
                    setLoading(false);
                } else {
                    openModal('잘못된 이메일 형식입니다.', '이메일 형식을 확인해 주세요.');
                }
            } else {
                openModal('미리보기 시도 후 전송하셔야 합니다.', '견적서를 한 번 확인 후에 시도해주세요.');
            }
        } else {
            openModal(
                '최소 주문 금액을 채워주세요.',
                `최소 주문 금액은 ${numberFormat(
                    company.minimum_order,
                )}원입니다.`,
            );
        }
    }, [props, company.minimum_order, estmFile, state, openModal]);

    const onDownload = () => {
        const doc = new jsPDF('p', 'mm');
        doc.addFileToVFS('AppleSDGothicNeoR.ttf', SDGothicNEO_R);
        doc.addFileToVFS('AppleSDGothicNeoB.ttf', SDGothicNEO_B);
        doc.addFont('AppleSDGothicNeoR.ttf', 'apple', 'normal');
        doc.addFont('AppleSDGothicNeoB.ttf', 'apple', 'bold');
        doc.setFont('apple');
        doc.autoTable({
            theme: 'plain',
            styles: {
                font: 'apple',
                fontSize: '30',
                fontStyle: 'bold',
                halign: 'center'
            },
            body: [['견적서']]
        })
        doc.autoTable({
            theme: 'plain',
            styles: {
                font: 'apple',
                fontStyle: 'normal',
                lineWidth: 0.5,
                lineColor: '#222',
                overflow: 'linebreak',
                halign: 'right',
                valign: 'middle'
            },
            headStyles: {
                halign: 'center'
            },
            html: '#estimate-table',
        });
        doc.autoTable({
            theme: 'plain',
            styles: {
                font: 'apple',
                fontStyle: 'normal',
                halign: 'center',
                fontSize: '12',
            },
            footStyles: {
                fontSize: '24',
                fontStyle: 'bold',
            },
            margin: { top: 100 },
            body: [['상기와 같이 견적서를 제출합니다.']],
            foot: [['샌달 드림']]
        })
        
        const blob = doc.output('blob');
        const makeFile = new File([blob], '샌달 견적서.pdf', {
            type: blob.type,
        });
        window.open(doc.output('bloburl'));
        setEstmFile(makeFile);
        setLoading(false);
    };

    return (
        <Dialog
            fullScreen
            open={props.open}
            onClose={props.handleClose}
            TransitionComponent={Transition}
        >
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        className={classes.close}
                        color="inherit"
                        onClick={props.handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        견적서 발송
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={styles['title']}>수신자</div>
            <DialogContent className={classes.content}>
                <div className={styles['modal-input-box']}>
                    <input
                        name="receiver"
                        className={styles['modal-input']}
                        onChange={onStateChange}
                        type="text"
                    />
                </div>
            </DialogContent>
            <div className={styles['title']}>받을 이메일 주소</div>
            <DialogContent className={classes.content}>
                <div className={styles['modal-input-box']}>
                    <input
                        name="receiver_email"
                        className={styles['modal-input']}
                        onChange={onStateChange}
                        type="email"
                    />
                </div>
            </DialogContent>
            <DialogContent
                className={`${classes.content} ${classes.estimate}`}
            >
                <ButtonBase className={classes.estimatePreview}>
                <Estimate
                    receiver={state.receiver}
                    com_name={com_name} ceo_name={ceo_name}
                    address={addr1 + ' ' + addr2} business_num={business_num}
                    tel={tel}
                    onDownload={onDownload}
                    products={props.cartList}
                    dlvCost={props.dlvCost}
                />
                </ButtonBase>
            </DialogContent>
            <LinkButton
                on={true}
                onClose={props.onClick}
                onSubmit={sendEstimate}
            />
            <Loading open={loading} />
        </Dialog>
    );
};

const LinkButton = ({ on, onClose, onSubmit }) => (
    <div className={styles['btn']}>
        <div className={cx('item', { on: !on })} onClick={onClose}>
            건너뛰기
        </div>
        <div className={cx('item', { on: on })} onClick={onSubmit}>
            견적서 발송
        </div>
    </div>
);

export default EstmModal;
