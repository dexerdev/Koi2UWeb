from scryp import encrypt,decrypt
import base64
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

gCode = 21000
sender_address = 'armuro.rey.dev@gmail.com'
sender_pass = 'llpfecndrrhilxmt'


def ifnull(var, val):
    if var is None:
        return val
    return var

def encryptText(k,text):
    key = k + str(gCode)
    cipherText = encrypt(text,key)
    return cipherText

def decryptText(k,text):
    key = k + str(gCode)
    plainText = decrypt(text,key)
    return plainText

def imageToBase64(path,filename):
    fullPath = path + '/' + filename
    with open(fullPath, "rb") as img_file:
        my_string = base64.b64encode(img_file.read())
    return my_string

def send_email(subject, from_email, to_email, cc_email, body):
    try:
        message = MIMEMultipart()
        message["From"] = from_email
        message["To"] = to_email
        message["Subject"] = subject

        message.attach(MIMEText(body, "html"))
        text = message.as_string()

        # Log in to server using secure context and send email
        smtpObj = smtplib.SMTP('smtp.gmail.com', 587)
        smtpObj.ehlo()
        smtpObj.starttls()
        smtpObj.login(sender_address, sender_pass)
        
        # smtpObj.set_debuglevel(False)
        # smtpObj.login(USERNAME, PASSWORD)
        return smtpObj.sendmail(from_email, to_email, text)
    except Exception as e:
        raise e
    finally:
        smtpObj.quit()
    # Create a multipart message and set headers


def thaiBath(currency):
    bahtTxt = ""
    n = ""
    bahtTH = ""
    amount = float(currency)
    bahtTxt = f'{amount:.2f}'
    num = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ" ]
    rank = [ "", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน" ]
    temp = bahtTxt.split('.')
    intVal = temp[0]
    decVal = temp[1]
    if (float(bahtTxt) == 0):
        bahtTH = "ศูนย์บาทถ้วน"
    else:
        for i in range(len(intVal)):
            n = intVal[i:i+1]
            if (n != "0"):
                if i == len(intVal) - 1 and n == "1":
                    bahtTH += "เอ็ด"
                elif i == len(intVal) - 2 and n == "2":
                    bahtTH += "ยี่"
                elif i == len(intVal) - 2 and n == "1":
                    bahtTH += ""
                else:
                    bahtTH += num[int(n)]
                bahtTH += rank[(len(intVal) - i) - 1]
        bahtTH += "บาท"
        if decVal == "00":
            bahtTH += "ถ้วน"
        else:
            for i in range(len(decVal)):
                n = decVal[i: i+1]
                if n != "0":
                    if i == len(decVal) - 1 and n == "1":
                        bahtTH += "เอ็ด"
                    elif i == len(decVal) - 2 and n == "2":
                        bahtTH += "ยี่"
                    elif i == len(decVal) - 2 and n == "1":
                        bahtTH += ""
                    else:
                        bahtTH += num[int(n)]
                    bahtTH += rank[(len(decVal) - i) - 1]
            bahtTH += "สตางค์"
    return bahtTH
