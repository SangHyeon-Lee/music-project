// import { RcFile } from 'antd/lib/upload';
import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import Login from './login';
import Register from './register';
import { auth } from './firebase';

interface AppRouterProps {
    history?: any;
}

const AppRouter: React.FC<AppRouterProps> = props => {
    const [user,setUser] = useState<any>('');
    
    useEffect(() => {    // 브라우저 API를 이용하여 문서 타이틀을 업데이트합니다.
        auth?.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
            } else {
                console.log("logout!!!!!!!!!");
                setUser(null);
            }
            console.log("logout!?")
        });
    });
    
    return (
        <HashRouter>
            {user &&
                <>
                    <App></App>
                </>
            }
            {!user &&
                <Switch>
                    <Route path="/login" exact component={Login} />
                    <Route path="/register" exact component={Register} />
                    <Route path="/" exact component={Login} />
                </Switch>
            }
        </HashRouter >
    );
}

export default AppRouter