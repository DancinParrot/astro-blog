---
title: "Tailscale for my Homelab"
pubDate: 2025-11-03
description: "An overview and guide on configuring Tailscale to remotely access the services within my homelab."
author: "Kai"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "Sample image"
tags: ["homelab", "tailscale", "vpn"]
---

For the longest time, I have always wanted a way to remotely access and configure my homelab. Previously, remote access was more of a nice-to-have rather than a necessity as I was only hosting a handful of services that were rather inactive. As such, I only researched and drafted a couple implementation ideas using Cloudflare Tunnel, ZeroTier, and TailScale, but no real execution was done.

Though, after the recent deployment of my website, I figured now’s the time for this. This article will walk through the steps that I took to install Tailscale in a LXC container running Alpine Linux with respect to the network layout of my homelab.

## Why Tailscale?

After much deliberation, I chose Tailscale to be my remote access solution. The reason is simple, although I enjoy learning to host various services, I also prefer to keep things straightforward. This is especially so for mission-critical services that deals with authentication like Tailscale. A managed service is always preferred instead of reinventing the wheel. Hence, Tailscale ticks all the boxes for my use case as it's easy to deploy and maintain which saves me a lot of headaches.

Likewise, ZeroTier is similar in the aspect of ease of use, but I prefer Tailscale's UI. Alternatively, Cloudflare Zero Trust offers comparable services like Cloudflare Tunnel and WARP Connector to access services hosted in a private network. There's a major difference between these two services though, in terms of the means to access such services. Cloudflare Tunnel exposes outbound-only traffic from the private server to Cloudflare which is different from a traditional VPN. On the other hand, Cloudflare WARP Connector is the VPN-equivalent that allows for site-site or user-to-site access to a private network. However, Cloudflare WARP is objectively more complicated to setup as compared to Tailscale.

## Proxmox

Moving on to the actual setup process, I created a LXC container on Proxmox that is installed with Alpine Linux, a minimal, security-oriented Linux distribution that works really well with containers and servers. It's also only a few megabytes in size which is perfect for my budget homelab with extremely limited space.

My home network setup is trivially segmented into a few subnets, featuring a DMZ, LAN, and MGMT. In this case, I attached the relevant network adapter to the container and configured the IP address as well as gateway to position Tailscale in my LAN. This provides me with full access to anywhere in my home network. Security-wise, this isn't the best idea as I figured it'd be better to have a seperate subnet just for the VPN via VLAN tagging as in the case of my MGMT subnet. This enables granular control over VPN traffic via stricter, fine-grained firewall rules as compared to lumping everything in LAN.

After that comes booting up the container to install Tailscale, but before that, the following lines will need to be added to the config file of the container at /etc/pve/1xx.conf if it's unprivilleged (recommended):

```bash
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

The aforementioned lines enable Tailscale's access to the `/dev/tun` device, or a virtual network interface which is necessary for its functionality (see [here](https://tailscale.com/kb/1130/lxc-unprivileged) for more details).

## Alpine

Once Proxmox has been setup, it's time to install `tailscale` on Alpine and configure it to run on startup. Since `tailscale` is already a [package](https://pkgs.alpinelinux.org/package/edge/community/x86/tailscale) on Alpine's community repository, it can be installed through Alpine's package manager, `apk`.

### Pre-install

Before installing any packages, it's best to perform a full system update:

```bash
apk update # update repository index
apk add --upgrade apk-tools # upgrade apk package manager
apk upgrade --available # upgrade all packages
```

Once the full system update has completed, reboot your system:

```bash
sync
reboot
```

To enable Alpine's community repository:

```bash
setup-apkrepos -c
```

You should be able to see the URL of the community repo in the `/etc/apk/repositories` file:

```bash
https://dl-cdn.alpinelinux.org/alpine/v3.22/main
https://dl-cdn.alpinelinux.org/alpine/v3.22/community
```

### Installing Tailscale

After which, install `tailscale`:

```bash
apk add tailscale
```

Since Alpine Linux uses OpenRC instead of systemd for its init system, enable and start `tailscale` as follows:

```bash
rc-service tailscale start
rc-update add tailscale default  # run on startup
```

Now, you may authenticate your `tailscale` client with your network:

```bash
tailscale up
```

## Subnet Router

Subnet router enables a Tailscale client to access other devices that are not installed and registered with `tailscale`. For instance, I want to remotely access services in my MGMT subnet but I do not want to go through the hassle of installing `tailscale` in all devices within that subnet. As a result, I can simply setup a Tailscale subnet router in my LAN, enable IP forwarding, and lastly, advertise routes to the MGMT subnet. This will enable Tailscale clients to connect to devices within advertised subnets as seen below:

![Tailscale](https://res.cloudinary.com/dq7mgdskm/image/upload/v1762348069/tailscale_c4n7cq.png)

### IP Forwarding

IP forwarding transforms the Alpine Linux container into a router, thereby allowing it to forward traffic from Tailscale's network to any advertised private subnet. In my case, it forwards network packets from the `tailscale0` interface to the `eth0` interface, which will then send the traffic to the LAN interface of my router and lastly, to its MGMT interface.

On Alpine Linux, enable IP forwarding by executing the following commands:

```bash
echo 'net.ipv4.ip_forward = 1' | tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | tee -a /etc/sysctl.d/99-tailscale.conf
sysctl -p /etc/sysctl.d/99-tailscale.conf
```

The aforementioned configuration may persisted across reboots by executing the `sysctl` command on startup using the following script:

```bash
#!/bin/sh
sysctl -p /etc/sysctl.d/99-tailscale.conf
```

The script as shown above is to be added to the `/etc/local.d` directory which allows the script to be executed by the `local` service on startup. The `local` service may be enabled as follows:

```bash
rc-update add local
```

### Advertise Routes

With IP forwarding successfully enabled, the `tailscale` client installed on the Alpine container may now be configured to advertise routes to the relevant subnets. In my case, I will advertise the MGMT subnet by specifying the network address and prefix:

```bash
tailscale set --advertise-routes=192.168.254.0/24
```

The configuration may be verified by sending ICMP pings to devices within the private subnet from devices connected to the Tailscale network. With `traceroute`, it is evident that traffic goes through the subnet router before reaching the destination:

```bash
traceroute to 192.168.254.1 (192.168.254.1), 30 hops max, 60 byte packets
 1  subnet-router.ts12345.ts.net (100.100.100.134)  37.784 ms  37.748 ms  37.743 ms
 2  192.168.254.1 (192.168.254.1)  37.738 ms  66.507 ms  66.517 ms
```

Lastly, key expiration should also be disabled on Tailscale's web console. Otherwise, upon restarting the Alpine container, the `tailscale` client will require re-authentication and thus, disrupting remote access.

## Conclusion

All in all, Tailscale is an amazing service with a generous free tier that offers a rather quick and painless process to setup a VPN for remote access.
