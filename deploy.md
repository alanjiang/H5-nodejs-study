#!/bin/sh

tomcat=/Users/zhangxiao/Desktop/tomcat8

rm -rf $tomcat/webapps/social

rm -rf $tomcat/webapps/social.zip

cp -r /Users/zhangxiao/eclipse-workspace/dian-cube-ui/social   $tomcat/webapps/

cd /Users/zhangxiao/Desktop/tomcat8/webapps/

zip -r social.zip social

scp  -i /Users/zhangxiao/Desktop/AWS-EC2-user/EC201-key.pem  $tomcat/webapps/social.zip  ec2-user@52.83.32.204:/home/ec2-user/
 
echo 'finish upload social.zip'

ssh root@52.83.32.204 > /dev/null 2>&1 << doneflag

mv /home/ec2-user/social.zip  /usr/home/dlm/

cd /usr/home/dlm/

echo `${pwd}`

rm -rf social

unzip -o social.zip


rm -rf social.zip

exit

doneflag

echo done!
