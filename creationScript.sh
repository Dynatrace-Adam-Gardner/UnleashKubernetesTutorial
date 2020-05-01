# Install OneAgent with --set-host-group=unleash-vm-demo
sudo apt update
sudo apt install docker.io -y
sudo usermod -aG docker $USER
docker network create my-net
