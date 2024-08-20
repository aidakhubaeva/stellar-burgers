import React, { FC, memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from '../../../services/store';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';
import styles from './order-card.module.css';
import { OrderCardUIProps } from './type';
import { OrderStatus } from '@components';
import { selectNewOrderId, setNewOrderId } from '../../../slices/burgerSlice';

export const OrderCardUI: FC<OrderCardUIProps> = memo(
  ({ orderInfo, maxIngredients, locationState, onClick }) => {
    const dispatch = useDispatch();
    const newOrderId = useSelector(selectNewOrderId);
    const isNew = newOrderId === orderInfo._id;

    useEffect(() => {
      if (isNew) {
        const timer = setTimeout(() => {
          dispatch(setNewOrderId(null));
        }, 5000);

        return () => clearTimeout(timer);
      }
    }, [isNew, dispatch]);

    const orderClassName = isNew
      ? `${styles.order} ${styles.order_new}`
      : styles.order;

    return (
      <Link
        to={orderInfo.number.toString()}
        relative='path'
        state={locationState}
        className={`p-6 mb-4 mr-2 ${orderClassName}`}
        onClick={onClick}
      >
        <div className={styles.order_info}>
          <span className={`text text_type_digits-default ${styles.number}`}>
            #{String(orderInfo.number).padStart(6, '0')}
          </span>
          <span className='text text_type_main-default text_color_inactive'>
            <FormattedDate date={orderInfo.date} />
          </span>
        </div>
        <h4 className={`pt-6 text text_type_main-medium ${styles.order_name}`}>
          {orderInfo.name}
        </h4>
        {locationState?.background?.pathname === '/profile/orders' && (
          <OrderStatus status={orderInfo.status} />
        )}
        <div className={`pt-6 ${styles.order_content}`}>
          <ul className={styles.ingredients}>
            {orderInfo.ingredientsToShow.map((ingredient, index) => {
              const zIndex = maxIngredients - index;
              const right = 20 * index;
              return (
                <li
                  className={styles.img_wrap}
                  style={{ zIndex: zIndex, right: right }}
                  key={index}
                >
                  <img
                    style={{
                      opacity:
                        orderInfo.remains && maxIngredients === index + 1
                          ? '0.5'
                          : '1'
                    }}
                    className={styles.img}
                    src={ingredient.image_mobile}
                    alt={ingredient.name}
                  />
                  {maxIngredients === index + 1 && orderInfo.remains > 0 && (
                    <span
                      className={`text text_type_digits-default ${styles.remains}`}
                    >
                      +{orderInfo.remains}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div>
            <span
              className={`text text_type_digits-default pr-1 ${styles.order_total}`}
            >
              {orderInfo.total}
            </span>
            <CurrencyIcon type='primary' />
          </div>
        </div>
      </Link>
    );
  }
);
