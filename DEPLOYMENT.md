# Deployment

## Architectuur

- **Hetzner VPS** met Docker
- **Traefik** als reverse proxy: vangt poort 80/443 op, stuurt verkeer naar de juiste container
- **Let's Encrypt** voor HTTPS, automatisch via Traefik (ACME tlschallenge)
- **App** container draait op poort 3000, alleen bereikbaar via Traefik
- **GitHub Actions** bouwt de image en pusht naar `ghcr.io`, deployt via SSH

## Hetzner VM

Maak een Ubuntu 24.04 server (CX22) aan in de Hetzner Cloud Console en voeg je SSH key toe. Noteer het IP.

## Domein

Maak een subdomein aan op duckdns.org en zet het IP van de VM erin.

## VM klaarzetten

```bash
ssh root@<IP>
apt update && apt upgrade -y
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh

curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy

ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable
```

## Project op VM

```bash
ssh deploy@<IP>
mkdir ~/gamehub && cd ~/gamehub
```

Maak een `.env`:

```
DOMAIN=jouwsubdomein.duckdns.org
ACME_EMAIL=jouw@email.com
GITHUB_REPOSITORY=ibra-amiri/mdi
MONGO_URI=mongodb+srv://...
```

Kopieer `docker-compose.yml` van de repo naar deze map.

## SSH key voor Actions

```bash
ssh-keygen -t ed25519 -f deploy_key -N ""
```

Publieke key (`deploy_key.pub`) toevoegen aan `~/.ssh/authorized_keys` van `deploy` user op de VM.

In GitHub repo > Settings > Secrets and variables > Actions:

- `SSH_HOST` = IP van de VM
- `SSH_USER` = `deploy`
- `SSH_PRIVATE_KEY` = inhoud van `deploy_key`

## Deploy

Push naar `main`. De workflow bouwt de image en deployt via SSH.

Eerste keer handmatig op de VM:

```bash
cd ~/gamehub
docker compose pull
docker compose up -d
```

## Logs

```bash
docker compose logs -f app
```
