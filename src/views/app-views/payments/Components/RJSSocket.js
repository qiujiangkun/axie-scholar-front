import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {API_BASE_URL} from "../../../../configs/AppConfig";

const RJSSocket = (props) => {
    const user = JSON.parse(localStorage.getItem('axie_user'));
    const dispatch = useDispatch();

    useEffect(() => {
        const connect = io(API_BASE_URL, { transports: ["websocket"] });

        connect.emit('user_id', user.id);
        connect.on('message', (msg) => {
            if(msg.user_id != user.id) return;
            if (typeof msg == 'object') {
                if (msg.type == "success") toast.success(<div>Name: {msg.name}<br />Description: {msg.message}</div>);
                else toast.warn(<div>Name: {msg.name}<br />Description: {msg.message}</div>);
            }
            else if (msg == "refresh") props.updateTable();
        });
        connect.on("update_scholar", (msg) => {
            if(msg.user_id != user.id) return;
            dispatch({ type: "UPDATE_SCHOLAR", payload: msg.data});
        })

        // return () => {
        //     connect.off();
        //     connect.disconnect();
        // }
    }, []); //props.scholars
    return (<>
    </>);
};

export default RJSSocket;