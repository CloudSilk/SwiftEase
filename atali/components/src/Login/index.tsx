import { Code, setToken, User } from "@swiftease/atali-pkg";
import { Alert, message, Tabs } from 'antd';
import React from "react";
import './index.less';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';

import {
    LockOutlined,
    MobileOutlined,
    UserOutlined,
} from '@ant-design/icons';

interface LoginComponentProps {
    formattedMessage: (id: string, defaultMessage: string) => JSX.Element
    formatMessage: (id: string, defaultMessage: string) => string
    fetchUserInfo: () => Promise<void>
    redirect: () => void
    loginBanner?: string
    title?: string
    subTitle?: string
    logo?: string
    name?: string
    footer?: React.ReactNode
    showLogo?: boolean
    login?: (params: any) => Promise<User.LoginResult>
    getFakeCaptcha?: (phone: string) => Promise<any>
    defaultUserName?: string
    defaultPassword?: string
    usePhoneLogin?: boolean
    showForgetPassword?: boolean
}

interface LoginComponentState {
    submitting: boolean
    userLoginState: User.LoginResult
    type: string
}

const LoginMessage: React.FC<{
    content: string;
}> = ({ content }) => (
    <Alert
        style={{
            marginBottom: 24,
        }}
        message={content}
        type="error"
        showIcon
    />
);

export class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState>{
    constructor(props: any) {
        super(props)
        this.state = {
            type: 'account',
            submitting: false,
            userLoginState: {
                code: Code.Success,
                message: '',
                data: '',
            }
        }
    }

    async handleSubmit(values: any) {
        const self = this
        try {
            // 登录
            if (!this.props.login) {
                return
            }
            let msg: User.LoginResult
            msg = await this.props.login({ ...values, type: self.state.type })

            if (msg.code === Code.Success) {
                setToken(msg.data);
                const defaultloginSuccessMessage = self.props.formatMessage('pages.login.success', '登录成功！');
                message.success(defaultloginSuccessMessage);
                await self.props.fetchUserInfo();
                self.props.redirect();
                return;
            }
            // 如果失败去设置用户错误信息
            self.setState({ userLoginState: msg })
        } catch (error) {
            const defaultloginFailureMessage = self.props.formatMessage('pages.login.failure', '登录失败，请重试！');

            message.error(defaultloginFailureMessage);
        }
    }

    async componentDidMount() {
    }

    setType(activeKey: string) {
        this.setState({ type: activeKey })
    }

    render() {
        return <div className={"container"}>
            <div className={"login"} style={{ marginTop: (document.body.offsetHeight - 708) / 2 }}>
                <div className={"loginBanner"}>
                    <img alt="logo" className={"loginBannerBg"} src={this.props.loginBanner ?? "/login-banner.png"} />
                    <div className={"loginBannerTitle"}>
                        <div className={"title"}>{this.props.title ?? "万物互联"}</div>
                        <div className={"split"}></div>
                        <div className={"subtitle"}>{this.props.subTitle ?? "用科技赋能实体"}</div>
                    </div>
                </div>
                <div className={"loginForm"}>
                    <div>
                        <div className={"content"}>
                            <div className={"top"}>
                                {this.props.showLogo && <div>
                                    <div className={"header"}>
                                        <img alt="logo" className={"logo"} src={this.props.logo ?? "/logo.svg"} />
                                    </div>
                                    <div className={"desc"}>
                                        {this.props.name}
                                    </div>
                                </div>}
                            </div>
                            <div className={"main"} style={{ marginTop: this.props.showLogo ? 0 : 156 }}>
                                <ProForm
                                    initialValues={{
                                        autoLogin: false,
                                        username: this.props.defaultUserName,
                                        password: this.props.defaultPassword
                                    }}
                                    submitter={{
                                        searchConfig: {
                                            submitText: this.props.formatMessage('pages.login.submit', '登录'),
                                        },
                                        render: (_, dom) => dom.pop(),
                                        submitButtonProps: {
                                            loading: this.state.submitting,
                                            size: 'large',
                                            style: {
                                                width: '100%',
                                                borderRadius: '370px'
                                            },
                                            htmlType: 'submit'
                                        },
                                    }}
                                    onFinish={async (values) => {
                                        await this.handleSubmit(values);
                                    }}
                                >
                                    <Tabs activeKey={this.state.type} onChange={(activeKey: string) => {
                                        this.setState({ type: activeKey })
                                    }}>
                                        <Tabs.TabPane
                                            key="account"
                                            tab={this.props.formatMessage('pages.login.accountLogin.tab', '账户密码登录')}
                                        />
                                        {this.props.usePhoneLogin && <Tabs.TabPane
                                            key="mobile"
                                            tab={this.props.formatMessage('pages.login.phoneLogin.tab', '手机号登录')}
                                        />}
                                    </Tabs>

                                    {status === 'error' && this.state.type === 'account' && (
                                        <LoginMessage
                                            content={this.props.formatMessage('pages.login.accountLogin.errorMessage', '账户或密码错误（admin/ant.design)')}
                                        />
                                    )}
                                    {this.state.type === 'account' && (
                                        <>
                                            <ProFormText
                                                name="username"
                                                fieldProps={{
                                                    size: 'large',
                                                    prefix: <UserOutlined className={"prefixIcon"} />,
                                                }}
                                                placeholder={this.props.formatMessage('pages.login.username.placeholder', '用户名: admin or user')}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: this.props.formattedMessage("pages.login.username.required", "请输入用户名!"),
                                                    },
                                                ]}
                                            />
                                            <ProFormText.Password
                                                name="password"
                                                fieldProps={{
                                                    size: 'large',
                                                    prefix: <LockOutlined className={"prefixIcon"} />,
                                                }}
                                                placeholder={this.props.formatMessage('pages.login.password.placeholder', '密码: ant.design')}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: this.props.formattedMessage("pages.login.password.required", "请输入密码！")
                                                    },
                                                ]}
                                            />
                                        </>
                                    )}

                                    {status === 'error' && this.state.type === 'mobile' && <LoginMessage content="验证码错误" />}
                                    {this.state.type === 'mobile' && this.props.usePhoneLogin && (
                                        <>
                                            <ProFormText
                                                fieldProps={{
                                                    size: 'large',
                                                    prefix: <MobileOutlined className={"prefixIcon"} />,
                                                }}
                                                name="mobile"
                                                placeholder={this.props.formatMessage('pages.login.phoneNumber.placeholder', '手机号')}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: this.props.formattedMessage("pages.login.phoneNumber.required", "请输入手机号！")
                                                    },
                                                    {
                                                        pattern: /^1\d{10}$/,
                                                        message: this.props.formattedMessage("pages.login.phoneNumber.invalid", "手机号格式错误！")
                                                    },
                                                ]}
                                            />
                                            <ProFormCaptcha
                                                fieldProps={{
                                                    size: 'large',
                                                    prefix: <LockOutlined className={"prefixIcon"} />,
                                                }}
                                                captchaProps={{
                                                    size: 'large',
                                                }}
                                                placeholder={this.props.formatMessage('pages.login.captcha.placeholder', '请输入验证码')}
                                                captchaTextRender={(timing, count) => {
                                                    if (timing) {
                                                        return `${count} ${this.props.formatMessage('pages.getCaptchaSecondText', '获取验证码')}`;
                                                    }
                                                    return this.props.formatMessage('pages.login.phoneLogin.getVerificationCode', '获取验证码');
                                                }}
                                                name="captcha"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: this.props.formattedMessage("pages.login.captcha.required", "请输入验证码！")
                                                    },
                                                ]}
                                                onGetCaptcha={async (phone) => {
                                                    if (phone === '') {
                                                        message.warning(this.props.formattedMessage("pages.login.phoneNumber.required", "请输入手机号！"))
                                                        return;
                                                    }
                                                    if (!this.props.getFakeCaptcha) return

                                                    const result = await this.props.getFakeCaptcha(phone);
                                                    if (result.Code !== Code.Success) {
                                                        message.warning(result.message)
                                                        return;
                                                    }
                                                    message.success('获取验证码成功！');
                                                }}
                                            />
                                        </>
                                    )}
                                    {this.props.showForgetPassword && <div
                                        style={{
                                            marginBottom: 24,
                                        }}
                                    >
                                        <ProFormCheckbox noStyle name="autoLogin">
                                            {this.props.formattedMessage("pages.login.rememberMe", "自动登录")}
                                        </ProFormCheckbox>
                                        <a
                                            style={{
                                                float: 'right',
                                            }}
                                        >
                                            {this.props.formattedMessage("pages.login.forgotPassword", "忘记密码")}
                                        </a>
                                    </div>}
                                </ProForm>
                            </div>
                        </div>
                    </div>
                    {this.props.footer}
                </div>
            </div>


        </div>
    }
}