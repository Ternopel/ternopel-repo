sudo iptables -t mangle -A PREROUTING -p tcp --dport 80 -j MARK --set-mark 1
sudo iptables -t mangle -A PREROUTING -p tcp --dport 443 -j MARK --set-mark 1
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8181
sudo iptables -I INPUT -m state --state NEW -m tcp -p tcp --dport 8080 -m mark --mark 1 -j ACCEPT
sudo iptables -I INPUT -m state --state NEW -m tcp -p tcp --dport 8181 -m mark --mark 1 -j ACCEPT