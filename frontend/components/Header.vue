<template>
  <header class="z-20 border-b bg-background/90 backdrop-blur">
    <UiContainer class="flex h-16 items-center justify-between md:h-20">
      <div class="flex items-center gap-10">
        <Logo />
        <UiNavigationMenu as="nav" class="header-main-nav hidden items-center justify-start gap-8 md:flex">
          <UiNavigationMenuList class="gap-2">
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-home" to="/" variant="ghost" size="sm">
                  Home
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-public" to="/public" variant="ghost" size="sm">
                  Public
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-private" to="/private" variant="ghost" size="sm">
                  Private
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
          </UiNavigationMenuList>
        </UiNavigationMenu>
      </div>
      <div class="md:hidden">
        <UiSheet>
          <UiSheetTrigger as-child>
            <UiButton variant="ghost" size="icon-sm">
              <Icon name="lucide:menu" class="h-5 w-5" />
            </UiButton>
            <UiSheetContent class="w-[90%] p-0">
              <UiSheetTitle class="sr-only" title="Mobile menu" />
              <UiSheetDescription class="sr-only" description="Mobile menu" />
              <UiSheetX class="z-20" />

              <UiScrollArea class="h-full p-5">
                <div class="flex flex-col gap-2">
                  <UiButton variant="ghost" class="justify-start text-base" to="/">
                    Home
                  </UiButton>
                  <UiButton variant="ghost" class="justify-start text-base" to="/public">
                    Public
                  </UiButton>
                  <UiButton variant="ghost" class="justify-start text-base" to="/private">
                    Private
                  </UiButton>
                  <UiGradientDivider class="my-5" />
                  <UiButton to="#">
                    Sign up
                  </UiButton>
                  <UiButton variant="outline" to="#">
                    Log in
                  </UiButton>
                </div>
              </UiScrollArea>
            </UiSheetContent>
          </UiSheetTrigger>
        </UiSheet>
      </div>
      <div class="header-login-nav hidden items-center gap-3 md:flex">
        <UiThingDataButtonWrapper data-testid="header-link-login" to="/login" variant="ghost" size="sm">
          Log in
        </UiThingDataButtonWrapper>
        <UiThingDataButtonWrapper data-testid="header-link-signup" to="/signup" variant="ghost" size="sm">
          Sign up
        </UiThingDataButtonWrapper>
      </div>
    </UiContainer>
  </header>
</template>