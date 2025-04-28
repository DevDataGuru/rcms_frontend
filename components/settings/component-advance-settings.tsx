'use client';
import Dropdown from '@/components/dropdown';
import IconArchive from '@/components/icon/icon-archive';
import IconArrowBackward from '@/components/icon/icon-arrow-backward';
import IconArrowForward from '@/components/icon/icon-arrow-forward';
import IconArrowLeft from '@/components/icon/icon-arrow-left';
import IconBook from '@/components/icon/icon-book';
import IconBookmark from '@/components/icon/icon-bookmark';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconChartSquare from '@/components/icon/icon-chart-square';
import IconDownload from '@/components/icon/icon-download';
import IconFile from '@/components/icon/icon-file';
import IconFolder from '@/components/icon/icon-folder';
import IconGallery from '@/components/icon/icon-gallery';
import IconHelpCircle from '@/components/icon/icon-help-circle';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconInfoHexagon from '@/components/icon/icon-info-hexagon';
import IconMenu from '@/components/icon/icon-menu';
import IconMessage2 from '@/components/icon/icon-message2';
import IconOpenBook from '@/components/icon/icon-open-book';
import IconPaperclip from '@/components/icon/icon-paperclip';
import IconPrinter from '@/components/icon/icon-printer';
import IconRefresh from '@/components/icon/icon-refresh';
import IconRestore from '@/components/icon/icon-restore';
import IconSearch from '@/components/icon/icon-search';
import IconSettings from '@/components/icon/icon-settings';
import IconStar from '@/components/icon/icon-star';
import IconTag from '@/components/icon/icon-tag';
import IconTrash from '@/components/icon/icon-trash';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconTxtFile from '@/components/icon/icon-txt-file';
import IconUser from '@/components/icon/icon-user';
import IconUsers from '@/components/icon/icon-users';
import IconVideo from '@/components/icon/icon-video';
import IconWheel from '@/components/icon/icon-wheel';
import IconZipFile from '@/components/icon/icon-zip-file';
import { IRootState } from '@/store';
import { Disclosure } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-quill/dist/quill.snow.css';
import { MdOutlineDirectionsCarFilled } from "react-icons/md";
import Tippy from '@tippyjs/react';

import { CiLocationOn } from "react-icons/ci";
import IconMessage from '../icon/icon-message';
import IconCamera from '../icon/icon-camera';
import IconCloudDownload from '../icon/icon-cloud-download';
import IconMail from '../icon/icon-mail';
import IconSave from '../icon/icon-save';
import { IoMdInformationCircleOutline } from "react-icons/io";
import ComponentGeneralSettings from './component-general-settings';
import ComponentEmailSettings from './component-email-settings';

const ComponentAdvanceSettings = () => {
    const [mailList, setMailList] = useState([
        {
            id: 1,
            path: 'profile-15.jpeg',
            firstName: 'Laurie',
            lastName: 'Fox',
            email: 'laurieFox@mail.com',
            date: new Date(),
            time: '2:00 PM',
            title: 'Promotion Page',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'inbox',
            isImportant: false,
            isStar: true,
            group: 'social',
            isUnread: false,
            attachments: [
                {
                    name: 'Confirm File.txt',
                    size: '450KB',
                    type: 'file',
                },
                {
                    name: 'Important Docs.xml',
                    size: '2.1MB',
                    type: 'file',
                },
            ],
            description: `
                              <p className="mail-content"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <div className="gallery text-center">
                                  <img alt="image-gallery" src="${'/assets/images/carousel3.jpeg'}" className="mb-4 mt-4" style="width: 250px; height: 180px;" />
                                  <img alt="image-gallery" src="${'/assets/images/carousel2.jpeg'}" className="mb-4 mt-4" style="width: 250px; height: 180px;" />
                                  <img alt="image-gallery" src="${'/assets/images/carousel1.jpeg'}" className="mb-4 mt-4" style="width: 250px; height: 180px;" />
                              </div>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 2,
            path: 'profile-14.jpeg',
            firstName: 'Andy',
            lastName: 'King',
            email: 'kingAndy@mail.com',
            date: new Date(),
            time: '6:28 PM',
            title: 'Hosting Payment Reminder',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 3,
            path: '',
            firstName: 'Kristen',
            lastName: 'Beck',
            email: 'kirsten.beck@mail.com',
            date: new Date(),
            time: '11:09 AM',
            title: 'Verification Link',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: 'social',
            isUnread: true,
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 4,
            path: 'profile-16.jpeg',
            firstName: 'Christian',
            lastName: '',
            email: 'christian@mail.com',
            date: '11/30/2021',
            time: '2:00 PM',
            title: 'New Updates',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: 'private',
            isUnread: false,
            attachments: [
                {
                    name: 'update.zip',
                    size: '1.38MB',
                    type: 'zip',
                },
            ],
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 5,
            path: 'profile-17.jpeg',
            firstName: 'Roxanne',
            lastName: '',
            email: 'roxanne@mail.com',
            date: '11/15/2021',
            time: '2:00 PM',
            title: 'Schedular Alert',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: 'personal',
            isUnread: true,
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 6,
            path: 'profile-18.jpeg',
            firstName: 'Nia',
            lastName: 'Hillyer',
            email: 'niahillyer@mail.com',
            date: '08/16/2020',
            time: '2:22 AM',
            title: 'Motion UI Kit',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'inbox',
            isImportant: true,

            isStar: true,
            group: '',
            isUnread: false,
            description: `
                              <p className="mail-content"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.</p>
                              <div className="gallery text-center">
                                  <img alt="image-gallery" src="${'/assets/images/carousel3.jpeg'}" className="mb-4 mt-4" style="width: 250px; height: 180px;">
                                  <img alt="image-gallery" src="${'/assets/images/carousel2.jpeg'}" className="mb-4 mt-4" style="width: 250px; height: 180px;">
                                  <img alt="image-gallery" src="${'/assets/images/carousel1.jpeg'}" className="mb-4 mt-4" style="width: 250px; height: 180px;">
                              </div>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 7,
            path: 'profile-19.jpeg',
            firstName: 'Iris',
            lastName: 'Hubbard',
            email: 'irishubbard@mail.com',
            date: '08/16/2020',
            time: '1:40 PM',
            title: 'Green Illustration',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'inbox',
            isImportant: true,

            isStar: true,
            group: '',
            isUnread: false,
            description: `
                              <p className="mail-content"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 8,
            path: '',
            firstName: 'Ernest',
            lastName: 'Reeves',
            email: 'reevesErnest@mail.com',
            date: '06/02/2020',
            time: '8:25 PM',
            title: 'Youtube',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'archive',
            isImportant: true,

            isStar: true,
            group: 'work',
            isUnread: false,
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 9,
            path: 'profile-20.jpeg',
            firstName: 'Info',
            lastName: 'Company',
            email: 'infocompany@mail.com',
            date: '02/10/2020',
            time: '7:00 PM',
            title: '50% Discount',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: 'work',
            isUnread: false,
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },

        {
            id: 10,
            path: '',
            firstName: 'NPM',
            lastName: 'Inc',
            email: 'npminc@mail.com',
            date: '12/15/2018',
            time: '8:37 AM',
            title: 'npm Inc',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'archive',
            isImportant: false,
            isStar: false,
            group: 'personal',
            isUnread: true,
            attachments: [
                {
                    name: 'package.zip',
                    size: '450KB',
                    type: 'zip',
                },
            ],
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 11,
            path: 'profile-21.jpeg',
            firstName: 'Marlene',
            lastName: 'Wood',
            email: 'marlenewood@mail.com',
            date: '11/25/2018',
            time: '1:51 PM',
            title: 'eBill',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: 'personal',
            isUnread: false,
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },

        {
            id: 12,
            path: '',
            firstName: 'Keith',
            lastName: 'Foster',
            email: 'kf@mail.com',
            date: '12/15/2018',
            time: '9:30 PM',
            title: 'Web Design News',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'draft',
            isImportant: false,
            isStar: false,
            group: 'personal',
            isUnread: false,
            description: `
                              <p className="mail-content"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.</p>
                              `,
        },
        {
            id: 13,
            path: '',
            firstName: 'Amy',
            lastName: 'Diaz',
            email: 'amyDiaz@mail.com',
            date: '12/15/2018',
            time: '2:00 PM',
            title: 'Ecommerce Analytics',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'draft',
            isImportant: false,
            isStar: false,
            group: 'private',
            isUnread: false,
            description: `
                              <p className="mail-content"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.</p>
                              `,
        },

        {
            id: 14,
            path: '',
            firstName: 'Alan',
            lastName: '',
            email: 'alan@mail.com',
            date: '12/16/2019',
            time: '8:45 AM',
            title: 'Mozilla Update',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'sent_mail',
            isImportant: false,
            isStar: false,
            group: 'work',
            isUnread: false,
            attachments: [
                {
                    name: 'Confirm File',
                    size: '450KB',
                    type: 'file',
                },
                {
                    name: 'Important Docs',
                    size: '2.1MB',
                    type: 'folder',
                },
                {
                    name: 'Photo.png',
                    size: '50kb',
                    type: 'image',
                },
            ],
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 15,
            path: '',
            firstName: 'Justin',
            lastName: 'Cross',
            email: 'justincross@mail.com',
            date: '09/14/219',
            time: '3:10 PM',
            title: 'App Project Checklist',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'sent_mail',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            attachments: [
                {
                    name: 'Important Docs',
                    size: '2.1MB',
                    type: 'folder',
                },
                {
                    name: 'Photo.png',
                    size: '50kb',
                    type: 'image',
                },
            ],
            description: `
                              <p className="mail-content"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },

        {
            id: 16,
            path: 'profile-21.jpeg',
            firstName: 'Alex',
            lastName: 'Gray',
            email: 'alexGray@mail.com',
            date: '08/16/2019',
            time: '10:18 AM',
            title: 'Weekly Newsletter',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'spam',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            attachments: [
                {
                    name: 'Confirm File',
                    size: '450KB',
                    type: 'file',
                },
                {
                    name: 'Important Docs',
                    size: '2.1MB',
                    type: 'folder',
                },
                {
                    name: 'Photo.png',
                    size: '50kb',
                    type: 'image',
                },
            ],
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 17,
            path: 'profile-22.jpeg',
            firstName: 'Info',
            lastName: 'Company',
            email: 'infocompany@mail.com',
            date: '02/10/2018',
            time: '7:00 PM',
            title: '50% Discount',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'spam',
            isImportant: false,
            isStar: false,
            group: 'work',
            isUnread: false,
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 18,
            path: 'profile-21.jpeg',
            firstName: 'Marlene',
            lastName: 'Wood',
            email: 'marlenewood@mail.com',
            date: '11/25/2017',
            time: '1:51 PM',
            title: 'eBill',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'spam',
            isImportant: false,
            isStar: false,
            group: 'personal',
            isUnread: false,
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },

        {
            id: 19,
            path: 'profile-23.jpeg',
            firstName: 'Ryan MC',
            lastName: 'Killop',
            email: 'ryanMCkillop@mail.com',
            date: '08/17/2018',
            time: '11:45 PM',
            title: 'Make it Simple',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'trash',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            description: `
                              <p className="mail-content"> Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <div className="gallery text-center">
                                  <img alt="image-gallery" src="${'/assets/images/carousel2.jpeg'}" className="mb-4 mt-4" style="width: 250px; height: 180px;">
                                  <img alt="image-gallery" src="${'/assets/images/carousel3.jpeg'}" className="mb-4 mt-4" style="width: 250px; height: 180px;">
                                  <img alt="image-gallery" src="${'/assets/images/carousel1.jpeg'}" className="mb-4 mt-4" style="width: 250px; height: 180px;">
                              </div>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 20,
            path: 'profile-23.jpeg',
            firstName: 'Liam',
            lastName: 'Sheldon',
            email: 'liamsheldon@mail.com',
            date: '08/17/2018 ',
            time: '11:45 PM',
            title: 'New Offers',
            displayDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
            type: 'trash',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            attachments: [
                {
                    name: 'Confirm File',
                    size: '450KB',
                    type: 'file',
                },
            ],
            description: `
                              <p className="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
        },
        {
            id: 21,
            path: 'profile-21.jpeg',
            firstName: 'Porter',
            lastName: 'Taylor',
            email: 'porter.harber@wiza.info',
            date: '06/01/2020',
            time: '02:40 PM',
            title: 'Id labore ex et quam laborum',
            displayDescription: 'Laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            description: `<p className="mail-content">Laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 22,
            path: 'profile-22.jpeg',
            firstName: 'Brock',
            lastName: 'Mills',
            email: 'brock.gibson@farrell.biz',
            date: '09/08/2020',
            time: '04:20 AM',
            title: 'Quo vero reiciendis velit similique earum',
            displayDescription:
                'Est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            description: `<p className="mail-content">Est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 23,
            path: 'profile-3.jpeg',
            firstName: 'Nyost',
            lastName: 'Terry',
            email: 'nyost@yahoo.com',
            date: '04/01/2019',
            time: '02:10 AM',
            title: 'Odio adipisci rerum aut animi',
            displayDescription:
                'Quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione',
            type: 'inbox',
            isImportant: true,
            isStar: false,
            group: 'personal',
            isUnread: false,
            description: `<p className="mail-content">Quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 24,
            path: 'profile-2.jpeg',
            firstName: 'Leonardo',
            lastName: 'Knox',
            email: 'leonardo61@yahoo.com',
            date: '08/08/2018',
            time: '07:50 PM',
            title: 'Alias odio sit',
            displayDescription: 'Non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati',
            type: 'inbox',
            isImportant: false,
            isStar: true,
            group: '',
            isUnread: false,
            description: `<p className="mail-content">Non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 25,
            path: 'profile-24.jpeg',
            firstName: 'Melisa',
            lastName: 'Mitchell',
            email: 'melisa.legros@mayer.com',
            date: '10/03/2018',
            time: '06:40 AM',
            title: 'Vero eaque aliquid doloribus et culpa',
            displayDescription: 'Harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et',
            type: 'inbox',
            isImportant: true,
            isStar: true,
            group: 'work',
            isUnread: false,
            description: `<p className="mail-content">Harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 26,
            path: 'profile-26.jpeg',
            firstName: 'Florida',
            lastName: 'Morgan',
            email: 'florida54@gmail.com',
            date: '05/12/2019',
            time: '09:20 PM',
            title: 'Et fugit eligendi deleniti quidem qui sint nihil autem',
            displayDescription:
                'Doloribus at sed quis culpa deserunt consectetur qui praesentium\naccusamus fugiat dicta\nvoluptatem rerum ut voluptate autem\nvoluptatem repellendus aspernatur dolorem in',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            description: `<p className="mail-content">Doloribus at sed quis culpa deserunt consectetur qui praesentium\naccusamus fugiat dicta\nvoluptatem rerum ut voluptate autem\nvoluptatem repellendus aspernatur dolorem in</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 27,
            path: 'profile-27.jpeg',
            firstName: 'Madison',
            lastName: 'King',
            email: 'madison86@yahoo.com',
            date: '12/04/2018',
            time: '10:40 PM',
            title: 'Repellat consequatur praesentium vel minus molestias voluptatum',
            displayDescription:
                'Maiores sed dolores similique labore et inventore et\nquasi temporibus esse sunt id et\neos voluptatem aliquam\naliquid ratione corporis molestiae mollitia quia et magnam dolor',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: 'private',
            isUnread: false,
            description: `<p className="mail-content">Maiores sed dolores similique labore et inventore et\nquasi temporibus esse sunt id et\neos voluptatem aliquam\naliquid ratione corporis molestiae mollitia quia et magnam dolor</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 28,
            path: 'profile-30.jpeg',
            firstName: 'Paul',
            lastName: 'Lambert',
            email: 'paul.cruickshank@yahoo.com',
            date: '06/05/2018',
            time: '01:40 AM',
            title: 'Et omnis dolorem',
            displayDescription: 'Ut voluptatem corrupti velit\nad voluptatem maiores\net nisi velit vero accusamus maiores\nvoluptates quia aliquid ullam eaque',
            type: 'inbox',
            isImportant: true,
            isStar: false,
            group: '',
            isUnread: false,
            description: `<p className="mail-content">Ut voluptatem corrupti velit\nad voluptatem maiores\net nisi velit vero accusamus maiores\nvoluptates quia aliquid ullam eaque</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 29,
            path: 'profile-31.jpeg',
            firstName: 'Brakus',
            lastName: 'Morrison',
            email: 'brakus.heidi@gmail.com',
            date: '03/09/2018',
            time: '06:10 PM',
            title: 'Provident id voluptas',
            displayDescription: 'Sapiente assumenda molestiae atque\nadipisci laborum distinctio aperiam et ab ut omnis\net occaecati aspernatur odit sit rem expedita\nquas enim ipsam minus',
            type: 'inbox',
            isImportant: false,
            isStar: true,
            group: 'social',
            isUnread: false,
            description: `<p className="mail-content">Sapiente assumenda molestiae atque\nadipisci laborum distinctio aperiam et ab ut omnis\net occaecati aspernatur odit sit rem expedita\nquas enim ipsam minus</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 30,
            path: 'profile-32.jpeg',
            firstName: 'Predovic',
            lastName: 'Peake',
            email: 'predovic.arianna@kirlin.com',
            date: '05/06/2018',
            time: '09:00 AM',
            title: 'Eaque et deleniti atque tenetur ut quo ut',
            displayDescription: 'Voluptate iusto quis nobis reprehenderit ipsum amet nulla\nquia quas dolores velit et non\naut quia necessitatibus\nnostrum quaerat nulla et accusamus nisi facili',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: 'personal',
            isUnread: false,
            description: `<p className="mail-content">Voluptate iusto quis nobis reprehenderit ipsum amet nulla\nquia quas dolores velit et non\naut quia necessitatibus\nnostrum quaerat nulla et accusamus nisi facili</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 31,
            path: 'profile-32.jpeg',
            firstName: 'shaylee',
            lastName: 'Buford',
            email: 'Buford@shaylee.biz',
            date: '07/03/2018',
            time: '08:15 AM',
            title: 'Ex velit ut cum eius odio ad placeat',
            displayDescription: 'Quia incidunt ut\naliquid est ut rerum deleniti iure est\nipsum quia ea sint et\nvoluptatem quaerat eaque repudiandae eveniet aut',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            description: `<p className="mail-content"></p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 32,
            path: 'profile-32.jpeg',
            firstName: 'Maria',
            lastName: 'laurel',
            email: 'Maria@laurel.name',
            date: '08/03/2018',
            time: '09:30 AM',
            title: 'Dolorem architecto ut pariatur quae qui suscipit',
            displayDescription: 'Nihil ea itaque libero illo\nofficiis quo quo dicta inventore consequatur voluptas voluptatem\ncorporis sed necessitatibus velit tempore\nrerum velit et temporibus',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            description: `<p className="mail-content"></p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 33,
            path: 'profile-32.jpeg',
            firstName: 'Jaeden',
            lastName: 'Towne',
            email: 'Jaeden.Towne@arlene.tv',
            date: '11/07/2018',
            time: '10:15 AM',
            title: 'Voluptatum totam vel voluptate omnis',
            displayDescription: 'Fugit harum quae vero\nlibero unde tempore\nsoluta eaque culpa sequi quibusdam nulla id\net et necessitatibus',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            description: `<p className="mail-content"></p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 34,
            path: 'profile-32.jpeg',
            firstName: 'Schneider',
            lastName: 'Ethelyn',
            email: 'Ethelyn.Schneider@emelia.co.uk',
            date: '07/11/2018',
            time: '10:30 AM',
            title: 'Omnis nemo sunt ab autem',
            displayDescription: 'Omnis temporibus quasi ab omnis\nfacilis et omnis illum quae quasi aut\nminus iure ex rem ut reprehenderit\nin non fugit',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            description: `<p className="mail-content"></p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
        {
            id: 35,
            path: 'profile-32.jpeg',
            firstName: 'Anna',
            lastName: 'Georgi',
            email: 'Georgianna@florence.io',
            date: '10/10/2017',
            time: '10:45 AM',
            title: 'Repellendus sapiente omnis praesentium aliquam ipsum id molestiae omnis',
            displayDescription: 'Dolor mollitia quidem facere et\nvel est ut\nut repudiandae est quidem dolorem sed atque\nrem quia aut adipisci sunt',
            type: 'inbox',
            isImportant: false,
            isStar: false,
            group: '',
            isUnread: false,
            description: `<p className="mail-content"></p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
        },
    ]);

    const defaultParams = {
        id: null,
        from: 'vristo@mail.com',
        to: '',
        cc: '',
        title: '',
        file: null,
        description: '',
        displayDescription: '',
    };

    const [isShowMailMenu, setIsShowMailMenu] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTab, setSelectedTab] = useState('generalSettings');
    const [filteredMailList, setFilteredMailList] = useState<any>(mailList.filter((d) => d.type === 'inbox'));
    const [ids, setIds] = useState<any>([]);
    const [searchText, setSearchText] = useState<any>('');
    const [selectedMail, setSelectedMail] = useState<any>(null);
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [pagedMails, setPagedMails] = useState<any>([]);


    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const [pager] = useState<any>({
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        startIndex: 0,
        endIndex: 0,
    });

    useEffect(() => {
        searchMails();
    }, [selectedTab, searchText, mailList]);

    const refreshMails = () => {
        setSearchText('');
        searchMails(false);
    };

    const setArchive = () => {
        if (ids.length) {
            let items = filteredMailList.filter((d: any) => ids.includes(d.id));
            for (let item of items) {
                item.type = item.type === 'archive' ? 'inbox' : 'archive';
            }
            if (selectedTab === 'archive') {
                showMessage(ids.length + ' Mail has been removed from Archive.');
            } else {
                showMessage(ids.length + ' Mail has been added to Archive.');
            }
            searchMails(false);
        }
    };

    const setSpam = () => {
        if (ids.length) {
            let items = filteredMailList.filter((d: any) => ids.includes(d.id));
            for (let item of items) {
                item.type = item.type === 'spam' ? 'inbox' : 'spam';
            }
            if (selectedTab === 'spam') {
                showMessage(ids.length + ' Mail has been removed from Spam.');
            } else {
                showMessage(ids.length + ' Mail has been added to Spam.');
            }
            searchMails(false);
        }
    };

    const setGroup = (group: any) => {
        if (ids.length) {
            let items = mailList.filter((d: any) => ids.includes(d.id));
            for (let item of items) {
                item.group = group;
            }

            showMessage(ids.length + ' Mail has been grouped as ' + group.toUpperCase());
            clearSelection();
            setTimeout(() => {
                searchMails(false);
            });
        }
    };

    const setAction = (type: any) => {
        if (ids.length) {
            const totalSelected = ids.length;
            let items = filteredMailList.filter((d: any) => ids.includes(d.id));
            for (let item of items) {
                if (type === 'trash') {
                    item.type = 'trash';
                    item.group = '';
                    item.isStar = false;
                    item.isImportant = false;
                    showMessage(totalSelected + ' Mail has been deleted.');
                    searchMails(false);
                } else if (type === 'read') {
                    item.isUnread = false;
                    showMessage(totalSelected + ' Mail has been marked as Read.');
                } else if (type === 'unread') {
                    item.isUnread = true;
                    showMessage(totalSelected + ' Mail has been marked as UnRead.');
                } else if (type === 'important') {
                    item.isImportant = true;
                    showMessage(totalSelected + ' Mail has been marked as Important.');
                } else if (type === 'unimportant') {
                    item.isImportant = false;
                    showMessage(totalSelected + ' Mail has been marked as UnImportant.');
                } else if (type === 'star') {
                    item.isStar = true;
                    showMessage(totalSelected + ' Mail has been marked as Star.');
                }
                //restore & permanent delete
                else if (type === 'restore') {
                    item.type = 'inbox';
                    showMessage(totalSelected + ' Mail Restored.');
                    searchMails(false);
                } else if (type === 'delete') {
                    setMailList(mailList.filter((d: any) => d.id != item.id));
                    showMessage(totalSelected + ' Mail Permanently Deleted.');
                    searchMails(false);
                }
            }
            clearSelection();
        }
    };

    const selectMail = (item: any) => {
        if (item) {
            if (item.type !== 'draft') {
                if (item && item.isUnread) {
                    item.isUnread = false;
                }
                setSelectedMail(item);
            } else {
                openMail('draft', item);
            }
        } else {
            setSelectedMail('');
        }
    };

    const setStar = (mailId: number) => {
        if (mailId) {
            let item = filteredMailList.find((d: any) => d.id === mailId);
            item.isStar = !item.isStar;
            setTimeout(() => {
                searchMails(false);
            });
        }
    };

    const setImportant = (mailId: number) => {
        if (mailId) {
            let item = filteredMailList.find((d: any) => d.id === mailId);
            item.isImportant = !item.isImportant;
            setTimeout(() => {
                searchMails(false);
            });
        }
    };

    const showTime = (item: any) => {
        const displayDt: any = new Date(item.date);
        const cDt: any = new Date();
        if (displayDt.toDateString() === cDt.toDateString()) {
            return item.time;
        } else {
            if (displayDt.getFullYear() === cDt.getFullYear()) {
                var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return monthNames[displayDt.getMonth()] + ' ' + String(displayDt.getDate()).padStart(2, '0');
            } else {
                return String(displayDt.getMonth() + 1).padStart(2, '0') + '/' + String(displayDt.getDate()).padStart(2, '0') + '/' + displayDt.getFullYear();
            }
        }
    };

    const openMail = (type: string, item: any) => {
        if (type === 'add') {
            setIsShowMailMenu(false);
            setParams(JSON.parse(JSON.stringify(defaultParams)));
        } else if (type === 'draft') {
            let data = JSON.parse(JSON.stringify(item));
            setParams({
                ...data,
                from: defaultParams.from,
                to: data.email,
                displayDescription: data.email,
            });
        } else if (type === 'reply') {
            let data = JSON.parse(JSON.stringify(item));
            setParams({
                ...data,
                from: defaultParams.from,
                to: data.email,
                title: 'Re: ' + data.title,
                displayDescription: 'Re: ' + data.title,
            });
        } else if (type === 'forward') {
            let data = JSON.parse(JSON.stringify(item));
            setParams({
                ...data,
                from: defaultParams.from,
                to: data.email,
                title: 'Fwd: ' + data.title,
                displayDescription: 'Fwd: ' + data.title,
            });
        }
        setIsEdit(true);
    };

    const searchMails = (isResetPage = true) => {
        if (isResetPage) {
            pager.currentPage = 1;
        }

        let res;
        if (selectedTab === 'important') {
            res = mailList.filter((d) => d.isImportant);
        } else if (selectedTab === 'star') {
            res = mailList.filter((d) => d.isStar);
        } else if (selectedTab === 'personal' || selectedTab === 'work' || selectedTab === 'social' || selectedTab === 'private') {
            res = mailList.filter((d) => d.group === selectedTab);
        } else {
            res = mailList.filter((d) => d.type === selectedTab);
        }

        let filteredRes = res.filter(
            (d) =>
                (d.title && d.title.toLowerCase().includes(searchText)) ||
                (d.firstName && d.firstName.toLowerCase().includes(searchText)) ||
                (d.lastName && d.lastName.toLowerCase().includes(searchText)) ||
                (d.displayDescription && d.displayDescription.toLowerCase().includes(searchText))
        );

        setFilteredMailList([
            ...res.filter(
                (d) =>
                    (d.title && d.title.toLowerCase().includes(searchText)) ||
                    (d.firstName && d.firstName.toLowerCase().includes(searchText)) ||
                    (d.lastName && d.lastName.toLowerCase().includes(searchText)) ||
                    (d.displayDescription && d.displayDescription.toLowerCase().includes(searchText))
            ),
        ]);

        if (filteredRes.length) {
            pager.totalPages = pager.pageSize < 1 ? 1 : Math.ceil(filteredRes.length / pager.pageSize);
            if (pager.currentPage > pager.totalPages) {
                pager.currentPage = 1;
            }
            pager.startIndex = (pager.currentPage - 1) * pager.pageSize;
            pager.endIndex = Math.min(pager.startIndex + pager.pageSize - 1, filteredRes.length - 1);
            setPagedMails([...filteredRes.slice(pager.startIndex, pager.endIndex + 1)]);
        } else {
            setPagedMails([]);
            pager.startIndex = -1;
            pager.endIndex = -1;
        }
        clearSelection();
    };

    const saveMail = (type: any, id: any) => {
        if (!params.to) {
            showMessage('To email address is required.', 'error');
            return false;
        }
        if (!params.title) {
            showMessage('Title of email is required.', 'error');
            return false;
        }

        let maxId = 0;
        if (!params.id) {
            maxId = mailList.length ? mailList.reduce((max, character) => (character.id > max ? character.id : max), mailList[0].id) : 0;
        }
        let cDt = new Date();

        let obj: any = {
            id: maxId + 1,
            path: '',
            firstName: '',
            lastName: '',
            email: params.to,
            date: cDt.getMonth() + 1 + '/' + cDt.getDate() + '/' + cDt.getFullYear(),
            time: cDt.toLocaleTimeString(),
            title: params.title,
            displayDescription: params.displayDescription,
            type: 'draft',
            isImportant: false,
            group: '',
            isUnread: false,
            description: params.description,
            attachments: null,
        };
        if (params.file && params.file.length) {
            obj.attachments = [];
            for (let file of params.file) {
                let flObj = {
                    name: file.name,
                    size: getFileSize(file.size),
                    type: getFileType(file.type),
                };
                obj.attachments.push(flObj);
            }
        }
        if (type === 'save' || type === 'save_reply' || type === 'save_forward') {
            //saved to draft
            obj.type = 'draft';
            mailList.splice(0, 0, obj);
            searchMails();
            showMessage('Mail has been saved successfully to draft.');
        } else if (type === 'send' || type === 'reply' || type === 'forward') {
            //saved to sent mail
            obj.type = 'sent_mail';
            mailList.splice(0, 0, obj);
            searchMails();
            showMessage('Mail has been sent successfully.');
        }

        setSelectedMail(null);
        setIsEdit(false);
    };

    const getFileSize = (file_type: any) => {
        let type = 'file';
        if (file_type.includes('image/')) {
            type = 'image';
        } else if (file_type.includes('application/x-zip')) {
            type = 'zip';
        }
        return type;
    };

    const getFileType = (total_bytes: number) => {
        let size = '';
        if (total_bytes < 1000000) {
            size = Math.floor(total_bytes / 1000) + 'KB';
        } else {
            size = Math.floor(total_bytes / 1000000) + 'MB';
        }
        return size;
    };

    const clearSelection = () => {
        setIds([]);
    };

    const tabChanged = (tabType: any) => {
        setIsEdit(false);
        setIsShowMailMenu(false);
        setSelectedMail(null);
    };

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const handleCheckboxChange = (id: any) => {
        if (ids.includes(id)) {
            setIds((value: any) => value.filter((d: any) => d !== id));
        } else {
            setIds([...ids, id]);
        }
    };

    const checkAllCheckbox = () => {
        if (filteredMailList.length && ids.length === filteredMailList.length) {
            return true;
        } else {
            return false;
        }
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    return (
        <div>
            <div className="relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)]">
                <div
                    className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowMailMenu ? '!block xl:!hidden' : ''}`}
                    onClick={() => setIsShowMailMenu(!isShowMailMenu)}
                ></div>
                <div
                    className={`panel dark:gray-50 absolute z-10 hidden h-full w-[250px] max-w-full flex-none space-y-3 overflow-hidden p-4 ltr:rounded-r-none rtl:rounded-l-none xl:relative xl:block xl:h-auto ltr:xl:rounded-r-md rtl:xl:rounded-l-md ${isShowMailMenu ? '!block' : ''
                        }`}
                >
                    <div className="flex h-full flex-col pb-16">
                        <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'generalSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                        }`}
                                    onClick={() => {
                                        setSelectedTab('generalSettings');
                                        tabChanged('generalSettings');
                                    }}
                                >
                                    <div className="flex items-center">
                                        <IconSettings className="h-5 w-5 shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">General Settings</div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'accountSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                        }`}
                                    onClick={() => {
                                        setSelectedTab('accountSettings');
                                        tabChanged('accountSettings');
                                    }}
                                >
                                    <div className="flex items-center">
                                        <IconArchive className="shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">Accounting settings</div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'customerSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                        }`}
                                    onClick={() => {
                                        setSelectedTab('customerSettings');
                                        tabChanged('customerSettings');
                                    }}
                                >
                                    <div className="flex items-center">
                                        <IconUser className="shrink-0" />

                                        <div className="ltr:ml-3 rtl:mr-3">Customers setting</div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'reservationSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                        }`}
                                    onClick={() => {
                                        setSelectedTab('reservationSettings');
                                        tabChanged('reservationSettings');
                                    }}
                                >
                                    <div className="flex items-center">
                                        <IconInfoHexagon className="shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">Reservations settings</div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'vehicleSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                        }`}
                                    onClick={() => {
                                        setSelectedTab('vehicleSettings');
                                        tabChanged('vehicleSettings');
                                    }}
                                >
                                    <div className="flex items-center">
                                        <MdOutlineDirectionsCarFilled className="h-4.5 w-4.5" />
                                        <div className="ltr:ml-3 rtl:mr-3">Vehicle settings</div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'orderSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                        }`}
                                    onClick={() => {
                                        setSelectedTab('orderSettings');
                                        tabChanged('orderSettings');
                                    }}
                                >
                                    <div className="flex items-center">
                                        <IconFile className="h-4.5 w-4.5" />
                                        <div className="ltr:ml-3 rtl:mr-3">Order settings</div>
                                    </div>
                                </button>

                                <Disclosure as="div">
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary">
                                                <IconCaretDown className={`h-5 w-5 shrink-0 ${open && 'rotate-180'}`} />

                                                <div className="ltr:ml-3 rtl:mr-3">{open ? 'Less' : 'More'}</div>
                                            </Disclosure.Button>

                                            <Disclosure.Panel as="ul" unmount={false} className="mt-1 space-y-1">
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'invoiceSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedTab('invoiceSettings');
                                                            tabChanged('invoiceSettings');
                                                        }}
                                                    >
                                                        <IconArchive className="shrink-0" />
                                                        <div className="ltr:ml-3 rtl:mr-3">Invoice settings</div>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'trafficFineSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedTab('trafficFineSettings');
                                                            tabChanged('trafficFineSettings');
                                                        }}
                                                    >
                                                        <IconCamera className="shrink-0" />
                                                        <div className="ltr:ml-3 rtl:mr-3">Traffic fine settings</div>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'salikSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedTab('salikSettings');
                                                            tabChanged('salikSettings');
                                                        }}
                                                    >
                                                        <CiLocationOn className="h-4.5 w-4.5" />
                                                        <div className="ltr:ml-3 rtl:mr-3">Salik settings</div>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'darbSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedTab('darbSettings');
                                                            tabChanged('darbSettings');
                                                        }}
                                                    >
                                                        <CiLocationOn className="h-4.5 w-4.5" />
                                                        <div className="ltr:ml-3 rtl:mr-3">Darb settings</div>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'smsSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedTab('smsSettings');
                                                            tabChanged('smsSettings');
                                                        }}
                                                    >
                                                        <IconMessage className="shrink-0" />
                                                        <div className="ltr:ml-3 rtl:mr-3">Sms settings</div>
                                                    </button>
                                                </li>

                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'leadSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedTab('leadSettings');
                                                            tabChanged('leadSettings');
                                                        }}
                                                    >
                                                        <IconCloudDownload className="shrink-0" />
                                                        <div className="ltr:ml-3 rtl:mr-3">Leads settings</div>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'printingSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedTab('printingSettings');
                                                            tabChanged('printingSettings');
                                                        }}
                                                    >
                                                        <IconPrinter className="shrink-0" />
                                                        <div className="ltr:ml-3 rtl:mr-3">Printing settings</div>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'trackingSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedTab('trackingSettings');
                                                            tabChanged('trackingSettings');
                                                        }}
                                                    >
                                                        <IconCloudDownload className="shrink-0" />
                                                        <div className="ltr:ml-3 rtl:mr-3">Tracking settings</div>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'emailSettings' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedTab('emailSettings');
                                                            tabChanged('emailSettings');
                                                        }}
                                                    >
                                                        <IconMail className="shrink-0" />
                                                        <div className="ltr:ml-3 rtl:mr-3">Email settings</div>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className={`flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'systemInformation' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedTab('systemInformation');
                                                            tabChanged('systemInformation');
                                                        }}
                                                    >
                                                        <IconInfoHexagon className="shrink-0" />
                                                        <div className="ltr:ml-3 rtl:mr-3">System information</div>
                                                    </button>
                                                </li>


                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>

                            </div>
                        </PerfectScrollbar>

                    </div>
                </div>

                <div className="panel h-full flex-1 overflow-x-hidden p-0">
                    {selectedTab === "generalSettings" && (
                        <ComponentGeneralSettings />
                    )}
                    {selectedTab === "accountSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Account Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="form-group">

                                    <label className="form-label">Company Currency</label>
                                    <select className="form-select">
                                        <option>Dirham</option>
                                        <option>Rupee</option>
                                        <option>USD</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Company location</label>
                                        <div className=''>
                                            <Tippy content="This mainly used for check the traffic fines functions." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <input
                                        id="cc"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company location"
                                        defaultValue={params.cc}
                                    />
                                </div>


                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Company Logo</label>
                                        <div className=''>
                                            <Tippy content="Default: https://alrahal.crs.ae/node/assets/img/nlogo/logo-systems.png?nver=033520" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <input
                                        type="file"
                                        className="form-input p-0 file:border-0 file:bg-primary/90 file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-primary"
                                        multiple
                                        accept="image/*,.zip,.pdf,.xls,.xlsx,.txt,.doc,.docx"
                                        required
                                    />
                                </div>
                                <div className="form-group">

                                    <label className="form-label">Company name</label>

                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company name"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company phone</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company phone"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner name</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner name"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner name (Arabic)</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner name (Arabic)"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner mobile</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner mobile"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company email address</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company email address"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company email address login url</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company email address"
                                        defaultValue={params.title}
                                    />
                                </div>
                                {/* <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Table displayed rows
                                        </label>
                                        <div className=''>
                                            <Tippy content="How many table rows to display by default?" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose table displayed rows</option>
                                        <option>10</option>
                                        <option>25</option>
                                        <option>50</option>
                                        <option>100</option>
                                    </select>
                                </div> */}
                                {/* <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Search results ordering </label>
                                        <div className=''>
                                            <Tippy content="Older (ASC) or Newer (DESC) First." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <select className="form-select">
                                        <option>Choose Search results ordering</option>
                                        <option value="Asc">Asc</option>
                                        <option value="Desc">Desc</option>
                                    </select>
                                </div> */}
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Activate live chat support </label>
                                        <div className=''>
                                            <Tippy content="Do you want to activate the live chat addon, we are here to help." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose Activate live chat support</option>
                                        <option value="Yes" >Yes</option>
                                        <option value="No" >No</option>
                                    </select>
                                </div>

                                <div className="form-group">

                                    <div className='flex justify-between'>

                                        <label className="form-label">Support team access</label>
                                        <div className=''>
                                            <Tippy content="For Your Security, Please select the data that our support team can see when they logged to your system.Default: Yes, Every Thing, Yes, Only Error Log, No, Support not Needed" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <div className="flex flex-row">
                                        <div>
                                            <input type="checkbox" name="support" value="everything" className="mr-2" checked />
                                            <label>Yes, Everything</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="support" value="error-log" className="mr-2" />
                                            <label>Yes, Only Error Log</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="support" value="no-support" className="mr-2" />
                                            <label>No, Support not Needed</label>
                                        </div>
                                    </div>
                                </div>

                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "customerSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Customers Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Customer Minimum Age</label>
                                        <div className=''>
                                            <Tippy content="Select the minimum age of customer" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <select className="form-select">
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                        <option value="24">24</option>
                                        <option value="25">25</option>
                                        <option value="26">26</option>
                                        <option value="27">27</option>
                                        <option value="28">28</option>
                                        <option value="29">29</option>
                                        <option value="30">30</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Customer Minimum Licence Expiry</label>
                                        <div className=''>
                                            <Tippy content="Select how many the minimum expiry date. for example: if you select (4) months, the data entry will not be able to put the license expiry before 4 months from now." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <select className="form-select">
                                        <option value="01">01</option>
                                        <option value="02">02</option>
                                        <option value="03">03</option>
                                        <option value="04">04</option>
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                        <option value="08">08</option>
                                        <option value="09">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Customer Minimum License Age
                                        </label>
                                        <div className=''>
                                            <Tippy content="Select how many the minimum age of customer driving license. for example: if you select (4) months, the data entry will be able to put the license issue date 4 months ago from now only." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <select className="form-select">
                                        <option value="01">01</option>
                                        <option value="02">02</option>
                                        <option value="03">03</option>
                                        <option value="04">04</option>
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                        <option value="08">08</option>
                                        <option value="09">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                        <option value="24">24</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Customer Minimum Passport Expiry
                                        </label>
                                        <div className=''>
                                            <Tippy content="Select how many the minimum expiry date. for example: if you select (4) months, the data entry will not be able to put the passport expiry before 4 months from now." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <select className="form-select">
                                        <option value="01">01</option>
                                        <option value="02">02</option>
                                        <option value="03">03</option>
                                        <option value="04">04</option>
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                        <option value="08">08</option>
                                        <option value="09">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Customer Minimum Identity Card Expiry
                                        </label>
                                        <div className=''>
                                            <Tippy content="Select how many the minimum expiry date. for example: if you select (4) months, the data entry will not be able to put the identity card expiry before 4 months from now." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <select className="form-select">
                                        <option value="01">01</option>
                                        <option value="02">02</option>
                                        <option value="03">03</option>
                                        <option value="04">04</option>
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                        <option value="08">08</option>
                                        <option value="09">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                        <option value="24">24</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Default Customer Status
                                        </label>
                                        <div className=''>
                                            <Tippy content="Select the default customer status that will be set when the customer added to the system, Unlimited Vehicle mean can rent multiple vehicles even if he or she already have a pending orders and Without a Vehicle mean that he or she can have only one pending updates order." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose Default Customer Status</option>
                                        <option value="wihtour a vehicle">wihtour a vehicle</option>
                                        <option value="unlimited vehicles">unlimited vehicles</option>
                                    </select>
                                </div>

                                {/* <div className="form-group">

                                    <div className='flex justify-between'>

                                        <label className="form-label">Customer Add New Order Roles
                                        </label>
                                        <div className=''>
                                            <Tippy content="If you dont want to open an order to a customer when the following conditions exists.
" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <div className="flex flex-row">
                                        <div>
                                            <input type="checkbox" name="support" value="everything" className="mr-2 form-checkbox" checked />
                                            <label>Unpaid inovices</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="support" value="error-log" className="mr-2 form-checkbox" />
                                            <label>Blacklisted</label>
                                        </div>
                                    </div>
                                </div> */}

                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "reservationSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Reservations Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
                                    <h1 className="text-xl font-bold text-gray-800 mb-2">Reservations Settings</h1>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Reservations General Options</h2>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Default: Do not allow multiple confirmed reservations for a single vehicle
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="restrictReservations"
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <label htmlFor="restrictReservations" className="text-gray-700">
                                            Do not allow multiple confirmed reservations for a single vehicle
                                        </label>
                                    </div>
                                </div>


                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "vehicleSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Vehicle Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="form-group">

                                    <label className="form-label">Odometer Measurement Unit
                                    </label>
                                    <select
                                        className="form-select"

                                    >
                                        <option>Choose odometer unit</option>
                                        <option value="km">Km - Killometer</option>
                                        <option value="mi">Mi-Mile</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Vehicle Expired Documents Exception: Alerting Days
                                        </label>
                                        <div className=''>
                                            <Tippy content="Enter the the number of days that you want the system to alert you before the expiry date." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-input"
                                        defaultValue={0}
                                    />
                                </div>







                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Vehicle Installments Transaction Category ID
                                        </label>
                                        <div className=''>
                                            <Tippy content="The ID can be found in the Transaction Categories System Settings page
" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <input
                                        type="number"
                                        className="form-input"
                                        defaultValue={0}
                                    />
                                </div>



                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "orderSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Order Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="form-group">

                                    <label className="form-label">Primary language</label>
                                    <input
                                        id="to"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Primary language"
                                        defaultValue={params.to}
                                    />
                                </div>

                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Company location</label>
                                        <div className=''>
                                            <Tippy content="This mainly used for check the traffic fines functions." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <input
                                        id="cc"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company location"
                                        defaultValue={params.cc}
                                    />
                                </div>


                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Company Logo</label>
                                        <div className=''>
                                            <Tippy content="Default: https://alrahal.crs.ae/node/assets/img/nlogo/logo-systems.png?nver=033520" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <input
                                        type="file"
                                        className="form-input p-0 file:border-0 file:bg-primary/90 file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-primary"
                                        multiple
                                        accept="image/*,.zip,.pdf,.xls,.xlsx,.txt,.doc,.docx"
                                        required
                                    />
                                </div>
                                <div className="form-group">

                                    <label className="form-label">Company name</label>

                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company name"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company phone</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company phone"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner name</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner name"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner name (Arabic)</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner name (Arabic)"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner mobile</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner mobile"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company email address</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company email address"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company email address login url</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company email address"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Table displayed rows
                                        </label>
                                        <div className=''>
                                            <Tippy content="How many table rows to display by default?" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose table displayed rows</option>
                                        <option>10</option>
                                        <option>25</option>
                                        <option>50</option>
                                        <option>100</option>
                                    </select>
                                </div>
                                {/* <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Search results ordering </label>
                                        <div className=''>
                                            <Tippy content="Older (ASC) or Newer (DESC) First." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <select className="form-select">
                                        <option>Choose Search results ordering</option>
                                        <option value="Asc">Asc</option>
                                        <option value="Desc">Desc</option>
                                    </select>
                                </div> */}
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Activate live chat support </label>
                                        <div className=''>
                                            <Tippy content="Do you want to activate the live chat addon, we are here to help." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose Activate live chat support</option>
                                        <option value="Yes" >Yes</option>
                                        <option value="No" >No</option>
                                    </select>
                                </div>

                                <div className="form-group">

                                    <div className='flex justify-between'>

                                        <label className="form-label">Support team access</label>
                                        <div className=''>
                                            <Tippy content="For Your Security, Please select the data that our support team can see when they logged to your system.Default: Yes, Every Thing, Yes, Only Error Log, No, Support not Needed" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <div className="flex flex-row">
                                        <div>
                                            <input type="checkbox" name="support" value="everything" className="mr-2" checked />
                                            <label>Yes, Everything</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="support" value="error-log" className="mr-2" />
                                            <label>Yes, Only Error Log</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="support" value="no-support" className="mr-2" />
                                            <label>No, Support not Needed</label>
                                        </div>
                                    </div>
                                </div>

                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "invoiceSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Invoice Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6"> <div className="p-6 max-w-2xl mx-auto border rounded-lg shadow-md bg-white">
                                <h2 className="text-lg font-semibold mb-4">Invoice Description Text</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Select the fields that you want to include in the invoice description, this option will not affect previous invoices, order id, vehicle category and number and daily rate already included.
                                </p>

                                <div className="space-y-2 mb-6">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange("addCustomerName")}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-gray-800">Add Customer Name</span>
                                    </label>

                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange("addCustomerMobile")}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-gray-800">Add Customer Mobile</span>
                                    </label>

                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange("addAuthorName")}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-gray-800">Add Author Name</span>
                                    </label>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="text-sm font-medium text-gray-800 mb-2">Print Template: Additional Fields</h3>
                                    <input
                                        type="text"
                                        placeholder=""
                                        className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                                    />
                                </div>
                            </div>
                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "trafficFineSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Traffic Fine Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Traffic Fine Office Extra Charges
                                        </label>
                                        <div className=''>
                                            <Tippy content="This number is an amount added to the fine amount. this will not applied to the old imported traffic fines." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <input
                                        id="cc"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company location"
                                        defaultValue={params.cc}
                                    />
                                </div>


                                <div className="form-group">

                                    <label className="form-label">Extrafee type of Traffic Fine Office Extra Charges
                                    </label>

                                    <select
                                        className="form-select"
                                    >
                                        <option value="Abu Dhbai Toll">Abu Dhbai Toll</option>
                                        <option value="Abu Dhbai Toll: Service charges">Abu Dhbai Toll: Service charges</option>
                                        <option value="Collection">Collection</option>
                                        <option value="Damages">Damages</option>
                                        <option value="Delivery">Delivery</option>
                                        <option value="Excess Killometers">Excess Killometers</option>
                                        <option value="Extra hours">Extra hours</option>
                                        <option value="Fuel charges">Fuel charges</option>
                                        <option value="Rental Fees">Rental Fees</option>
                                        <option value="Salik Fees">Salik Fees</option>
                                        <option value="Salik Parking">Salik Parking</option>
                                        <option value="Traffic Fines">Traffic Fines</option>                                    </select>
                                </div>

                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Traffic Fine Automation Status

                                        </label>
                                        <div className=''>
                                            <Tippy content="Activate or Disable the Automation Process of Importing the Traffic Fines." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose Traffic Fine Automation Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Disable">Disable</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Traffic Fine Automation Mode                                        </label>
                                        <div className=''>
                                            <Tippy content="THIS FEATURE WILL NOT AFFECT OLD ENTRIES." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <select className="form-select">
                                        <option>Choose Traffic Fine Automation Mode</option>
                                        <option value="Import">Import</option>
                                        <option value="sync">sync</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Traffic Fine Auto Amount Update Status
                                        </label>
                                        <div className=''>
                                            <Tippy content="Activate or Disable the get latest Traffic Fine Amount automaticly feature (note: This feature need the following to work per each request invoice = unpaid and this option = active and order total remaining traffic fines > 0 and current tf amount not equal new tf amount, if those all are presented then the amount of the traffic fine will be updated)." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose Traffic Fine Auto Amount Update Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Disable">Disable</option>
                                    </select>
                                </div>
                                <div className="form-group">

                                    <label className="form-label">Traffic Fine Amount
                                    </label>

                                    <select className="form-select">
                                        <option>Choose Traffic Fine Auto Amount Update Status</option>
                                        <option value="Amount after discount">Amount after discount</option>
                                        <option value="Total amount">Total amount</option>
                                    </select>
                                </div>


                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "salikSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Salik Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Salik Features Status</label>
                                        <div className=''>
                                            <Tippy content="Default: Disable" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <select
                                        id="cc"
                                        className="form-select"
                                    >
                                        <option value="Activate">Activate</option>
                                        <option value="Disbale">Disable</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Salik Trips Service Fees</label>
                                        <div className=''>
                                            <Tippy content="Old entries will not be affected." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <input
                                        id="cc"
                                        type="text"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Salik Trips Service Fees Account</label>
                                        <div className=''>
                                            <Tippy content="This amount will be added to the darb trip fee. will not affect previous entries, 0 to disable" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <select
                                        id="cc"
                                        className="form-select"
                                    >
                                        <option value="Abu Dhbai Toll">Abu Dhbai Toll</option>
                                        <option value="Abu Dhbai Toll: Service charges">Abu Dhbai Toll: Service charges</option>
                                        <option value="Collection">Collection</option>
                                        <option value="Damages">Damages</option>
                                        <option value="Delivery">Delivery</option>
                                        <option value="Excess Killometers">Excess Killometers</option>
                                        <option value="Extra hours">Extra hours</option>
                                        <option value="Fuel charges">Fuel charges</option>
                                        <option value="Rental Fees">Rental Fees</option>
                                        <option value="Salik Fees">Salik Fees</option>
                                        <option value="Salik Parking">Salik Parking</option>
                                        <option value="Traffic Fines">Traffic Fines</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Salik Parking Service Fees</label>
                                        <div className=''>
                                            <Tippy content="Old entries will not be affected." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <input
                                        type="number"
                                        className="form-input"
                                        defaultValue={0}
                                    />
                                </div>


                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "darbSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Darb Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Darb status</label>
                                        <div className=''>
                                            <Tippy content="Activate or Disable the All Darb Features." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <select
                                        id="cc"
                                        className="form-select"
                                    >
                                        <option value="Activate">Activate</option>
                                        <option value="Disbale">Disable</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Service Fees Amount                      </label>
                                        <div className=''>
                                            <Tippy content="This amount will be added to the darb trip fee. will not affect previous entries, 0 to disable" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <input
                                        id="cc"
                                        type="text"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Service Fees Amount  </label>
                                        <div className=''>
                                            <Tippy content="This amount will be added to the darb trip fee. will not affect previous entries, 0 to disable" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <input
                                        type="number"
                                        className="form-input"
                                        defaultValue={0}
                                    />
                                </div>


                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "smsSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Sms Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="form-group">

                                    <label className="form-label">Primary language</label>
                                    <input
                                        id="to"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Primary language"
                                        defaultValue={params.to}
                                    />
                                </div>

                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Company location</label>
                                        <div className=''>
                                            <Tippy content="This mainly used for check the traffic fines functions." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <input
                                        id="cc"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company location"
                                        defaultValue={params.cc}
                                    />
                                </div>


                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Company Logo</label>
                                        <div className=''>
                                            <Tippy content="Default: https://alrahal.crs.ae/node/assets/img/nlogo/logo-systems.png?nver=033520" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <input
                                        type="file"
                                        className="form-input p-0 file:border-0 file:bg-primary/90 file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-primary"
                                        multiple
                                        accept="image/*,.zip,.pdf,.xls,.xlsx,.txt,.doc,.docx"
                                        required
                                    />
                                </div>
                                <div className="form-group">

                                    <label className="form-label">Company name</label>

                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company name"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company phone</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company phone"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner name</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner name"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner name (Arabic)</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner name (Arabic)"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner mobile</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner mobile"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company email address</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company email address"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company email address login url</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company email address"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Table displayed rows
                                        </label>
                                        <div className=''>
                                            <Tippy content="How many table rows to display by default?" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose table displayed rows</option>
                                        <option>10</option>
                                        <option>25</option>
                                        <option>50</option>
                                        <option>100</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Search results ordering </label>
                                        <div className=''>
                                            <Tippy content="Older (ASC) or Newer (DESC) First." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <select className="form-select">
                                        <option>Choose Search results ordering</option>
                                        <option value="Asc">Asc</option>
                                        <option value="Desc">Desc</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Activate live chat support </label>
                                        <div className=''>
                                            <Tippy content="Do you want to activate the live chat addon, we are here to help." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose Activate live chat support</option>
                                        <option value="Yes" >Yes</option>
                                        <option value="No" >No</option>
                                    </select>
                                </div>

                                <div className="form-group">

                                    <div className='flex justify-between'>

                                        <label className="form-label">Support team access</label>
                                        <div className=''>
                                            <Tippy content="For Your Security, Please select the data that our support team can see when they logged to your system.Default: Yes, Every Thing, Yes, Only Error Log, No, Support not Needed" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <div className="flex flex-row">
                                        <div>
                                            <input type="checkbox" name="support" value="everything" className="mr-2" checked />
                                            <label>Yes, Everything</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="support" value="error-log" className="mr-2" />
                                            <label>Yes, Only Error Log</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="support" value="no-support" className="mr-2" />
                                            <label>No, Support not Needed</label>
                                        </div>
                                    </div>
                                </div>

                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "leadSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Leads Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Lead Expiry
                                        </label>
                                        <div className=''>
                                            <Tippy content="Enter the number of days to wait till the lead considered expired." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>
                                        </div>
                                    </div>


                                    <input
                                        type="text"
                                        className="form-input "
                                        required
                                    />
                                </div>


                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "printingSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Prinitng Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="form-group">

                                    <label className="form-label">Primary language</label>
                                    <input
                                        id="to"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Primary language"
                                        defaultValue={params.to}
                                    />
                                </div>

                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Company location</label>
                                        <div className=''>
                                            <Tippy content="This mainly used for check the traffic fines functions." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <input
                                        id="cc"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company location"
                                        defaultValue={params.cc}
                                    />
                                </div>


                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Company Logo</label>
                                        <div className=''>
                                            <Tippy content="Default: https://alrahal.crs.ae/node/assets/img/nlogo/logo-systems.png?nver=033520" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <input
                                        type="file"
                                        className="form-input p-0 file:border-0 file:bg-primary/90 file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-primary"
                                        multiple
                                        accept="image/*,.zip,.pdf,.xls,.xlsx,.txt,.doc,.docx"
                                        required
                                    />
                                </div>
                                <div className="form-group">

                                    <label className="form-label">Company name</label>

                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company name"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company phone</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company phone"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner name</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner name"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner name (Arabic)</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner name (Arabic)"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner mobile</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner mobile"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company email address</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company email address"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company email address login url</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company email address"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Table displayed rows
                                        </label>
                                        <div className=''>
                                            <Tippy content="How many table rows to display by default?" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose table displayed rows</option>
                                        <option>10</option>
                                        <option>25</option>
                                        <option>50</option>
                                        <option>100</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Search results ordering </label>
                                        <div className=''>
                                            <Tippy content="Older (ASC) or Newer (DESC) First." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <select className="form-select">
                                        <option>Choose Search results ordering</option>
                                        <option value="Asc">Asc</option>
                                        <option value="Desc">Desc</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Activate live chat support </label>
                                        <div className=''>
                                            <Tippy content="Do you want to activate the live chat addon, we are here to help." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose Activate live chat support</option>
                                        <option value="Yes" >Yes</option>
                                        <option value="No" >No</option>
                                    </select>
                                </div>

                                <div className="form-group">

                                    <div className='flex justify-between'>

                                        <label className="form-label">Support team access</label>
                                        <div className=''>
                                            <Tippy content="For Your Security, Please select the data that our support team can see when they logged to your system.Default: Yes, Every Thing, Yes, Only Error Log, No, Support not Needed" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <div className="flex flex-row">
                                        <div>
                                            <input type="checkbox" name="support" value="everything" className="mr-2" checked />
                                            <label>Yes, Everything</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="support" value="error-log" className="mr-2" />
                                            <label>Yes, Only Error Log</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="support" value="no-support" className="mr-2" />
                                            <label>No, Support not Needed</label>
                                        </div>
                                    </div>
                                </div>

                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "trackingSettings" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Tracking Settings</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-4 md:grid-cols-4 gap-6 p-6">
                                <div className="flex justify-center">
                                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
                                        <h1 className="text-xl font-bold text-gray-800 mb-2">Tracking Settings</h1>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Everything related to online tracking.
                                        </p>
                                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Tracking Order Visible Information</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Select sections that you want to make them visible on the tracking page if it's activated.
                                        </p>
                                        <div className="space-y-2">
                                            {/* <!-- Activate Order Tracking --> */}
                                            <label className="flex items-center space-x-2">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                                                <span className="text-gray-700">Activate Order Tracking?</span>
                                            </label>
                                            {/* <!-- Display Pending Updates Orders Only --> */}
                                            <label className="flex items-center space-x-2">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                                                <span className="text-gray-700">Display Pending Updates Orders Only</span>
                                            </label>
                                            {/* <!-- Order Information --> */}
                                            <label className="flex items-center space-x-2">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                                                <span className="text-gray-700">Order Information</span>
                                            </label>
                                            {/* <!-- Customer Information --> */}
                                            <label className="flex items-center space-x-2">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                                                <span className="text-gray-700">Customer Information</span>
                                            </label>
                                            {/* <!-- Vehicle Information --> */}
                                            <label className="flex items-center space-x-2">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                                                <span className="text-gray-700">Vehicle Information</span>
                                            </label>
                                            {/* <!-- Invoice Information --> */}
                                            <label className="flex items-center space-x-2">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                                                <span className="text-gray-700">Invoice Information</span>
                                            </label>
                                            {/* <!-- Transactions Information --> */}
                                            <label className="flex items-center space-x-2">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                                                <span className="text-gray-700">Transactions Information</span>
                                            </label>
                                            {/* <!-- Order Attachments --> */}
                                            <label className="flex items-center space-x-2">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                                                <span className="text-gray-700">Order Attachments</span>
                                            </label>
                                            {/* <!-- Notes Line --> */}
                                            <label className="flex items-center space-x-2">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                                                <span className="text-gray-700">Notes Line</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}
                    {selectedTab === "emailSettings" && (

                        <ComponentEmailSettings />
                    )}
                    {selectedTab === "systemInformation" && (

                        <div className="relative">
                            <div className="flex items-center px-6 py-4">
                                <button
                                    type="button"
                                    className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                >
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">System Information</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="form-group">

                                    <label className="form-label">Primary language</label>
                                    <input
                                        id="to"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Primary language"
                                        defaultValue={params.to}
                                    />
                                </div>

                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Company location</label>
                                        <div className=''>
                                            <Tippy content="This mainly used for check the traffic fines functions." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>

                                    <input
                                        id="cc"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company location"
                                        defaultValue={params.cc}
                                    />
                                </div>


                                <div className="form-group">
                                    <div
                                        className='flex justify-between'>

                                        <label className="form-label">Company Logo</label>
                                        <div className=''>
                                            <Tippy content="Default: https://alrahal.crs.ae/node/assets/img/nlogo/logo-systems.png?nver=033520" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <input
                                        type="file"
                                        className="form-input p-0 file:border-0 file:bg-primary/90 file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-primary"
                                        multiple
                                        accept="image/*,.zip,.pdf,.xls,.xlsx,.txt,.doc,.docx"
                                        required
                                    />
                                </div>
                                <div className="form-group">

                                    <label className="form-label">Company name</label>

                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company name"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company phone</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company phone"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner name</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner name"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner name (Arabic)</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner name (Arabic)"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Owner mobile</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Owner mobile"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company email address</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company email address"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company email address login url</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter Company email address"
                                        defaultValue={params.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Table displayed rows
                                        </label>
                                        <div className=''>
                                            <Tippy content="How many table rows to display by default?" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose table displayed rows</option>
                                        <option>10</option>
                                        <option>25</option>
                                        <option>50</option>
                                        <option>100</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Search results ordering </label>
                                        <div className=''>
                                            <Tippy content="Older (ASC) or Newer (DESC) First." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>
                                    <select className="form-select">
                                        <option>Choose Search results ordering</option>
                                        <option value="Asc">Asc</option>
                                        <option value="Desc">Desc</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className='flex justify-between'>

                                        <label className="form-label">Activate live chat support </label>
                                        <div className=''>
                                            <Tippy content="Do you want to activate the live chat addon, we are here to help." placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <select className="form-select">
                                        <option>Choose Activate live chat support</option>
                                        <option value="Yes" >Yes</option>
                                        <option value="No" >No</option>
                                    </select>
                                </div>

                                <div className="form-group">

                                    <div className='flex justify-between'>

                                        <label className="form-label">Support team access</label>
                                        <div className=''>
                                            <Tippy content="For Your Security, Please select the data that our support team can see when they logged to your system.Default: Yes, Every Thing, Yes, Only Error Log, No, Support not Needed" placement="left">
                                                <button type="button">
                                                    <IoMdInformationCircleOutline
                                                        className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                                    />
                                                </button>
                                            </Tippy>

                                        </div>
                                    </div>


                                    <div className="flex flex-row">
                                        <div>
                                            <input type="checkbox" name="support" value="everything" className="mr-2" checked />
                                            <label>Yes, Everything</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="support" value="error-log" className="mr-2" />
                                            <label>Yes, Only Error Log</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="support" value="no-support" className="mr-2" />
                                            <label>No, Support not Needed</label>
                                        </div>
                                    </div>
                                </div>

                            </form>

                            {/* <!-- Sticky Save Button --> */}
                            {/* <div className="sticky bottom-0 bg-white p-4 border-t">
                        </div>
 */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        className="btn btn-success ltr:mr-3 rtl:ml-3"
                                        onClick={() => saveMail('save', null)}
                                    >
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save changes
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ComponentAdvanceSettings;
