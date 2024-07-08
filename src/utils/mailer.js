import _ from 'lodash'
import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import constant from '../constant.js'

class EmailHelper {
  /**
   * 初始化email
   * @param {object} cfg 参数有host/port/user/pass
   */
  constructor(cfg) {
    this.config = cfg;
    // 开启一个SMTP连接池
    this.transport = nodemailer.createTransport(smtpTransport({
      service: this.config.service,
      secure: true,// 使用SSL
      host: this.config.host,
      port: this.config.port,
      auth: {
        user: this.config.user,
        pass: this.config.pass
      }
    }));
  }
  async render(filename, data = {}) {
    return await ejs.renderFile(path.join(constant.PATH.SRC, `templates/email/${filename}`), data)
  }
  async sendMail(users, subject, html, attachments = []) {
    // 设置邮件内容
    const options = {
      from: `${this.config.name} <${this.config.user}>`,
      subject,
      html
    };
    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      // 发送邮件
      await this.transport.sendMail(_.extend(options, {
        to: `${user.name} <${user.email}>`,
        attachments,
      }), function (error, res) {
        if (error) {
          console.log(error);
        } else {
          console.log(res);
        }
      });
    }
  }
}
export default EmailHelper;