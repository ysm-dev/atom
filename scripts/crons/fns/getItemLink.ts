export const getItemLink = (link: string): string => {
  if (isXPostLink(link)) {
    const { pathname } = new URL(link)
    return `https://fixupx.com${pathname}/ko`
  }

  return link
}

const isXPostLink = (link: string): boolean => {
  const { hostname, pathname } = new URL(link)

  if (
    ["x.com", "twitter.com"].includes(hostname) &&
    pathname.split("/").length === 4
  ) {
    return true
  }

  return false
}
